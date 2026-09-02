import { blinnSpecular, dielectricFresnel, spectralWeight, waterRefractOffset } from "./lighting.wgsl";
import { sampleWaves } from "./waves.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

// Water IOR and spectral spread follow transmission/glass.wgsl
// (`glass.ior`, `dispersion_spread`) retuned for seawater, not glass.
const WATER_IOR: f32 = 1.333;
const DISPERSION: f32 = 0.06;

struct Params {
  time: f32,
  windSpeed: f32,
  texel: vec2f,
  boatUv: vec2f,
  beamDir: vec2f,
  windAngle: f32,
  quality: f32,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var plate: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn viewSize() -> vec2f {
  return 1.0 / max(params.texel, vec2f(1.0e-5));
}

fn coverUv(uv: vec2f) -> vec2f {
  let tex = vec2f(textureDimensions(plate));
  let view = viewSize();
  let scale = max(view.x / max(tex.x, 1.0), view.y / max(tex.y, 1.0));
  return (uv - 0.5) * (view / (tex * scale)) + 0.5;
}

fn samplePlate(uv: vec2f) -> vec3f {
  let mapped = coverUv(uv);
  let inside = all(mapped >= vec2f(0.0)) && all(mapped <= vec2f(1.0));
  let texel = textureSampleLevel(plate, samp, clamp(mapped, vec2f(0.0), vec2f(1.0)), 0.0).rgb;
  return select(vec3f(0.004, 0.012, 0.03), texel, inside);
}

fn luma(c: vec3f) -> f32 {
  return dot(c, vec3f(0.2126, 0.7152, 0.0722));
}

fn beamMask(uv: vec2f, n: vec3f, height: f32) -> vec3f {
  let dir = normalize(params.beamDir);
  let origin = params.boatUv;
  let aspect = viewSize().y / max(viewSize().x, 1.0);
  let warped = uv + n.xz * vec2f(0.028, 0.028 / max(aspect, 0.2));
  let toPoint = (warped - origin) * vec2f(1.0, aspect);
  let along = dot(toPoint, dir);
  let side = abs(dot(toPoint, vec2f(-dir.y, dir.x)));
  let width = 0.01 + along * 0.145 + height * 0.018;
  let cone = 1.0 - smoothstep(width, width + 0.055 + abs(height) * 0.03, side);
  let shaft = smoothstep(-0.02, 0.04, along) * (1.0 - smoothstep(0.78, 1.22, along));
  let core = 1.0 - smoothstep(width * 0.22, width * 0.82, side);
  let beam = clamp(cone * shaft, 0.0, 1.0);
  let rim = beam * (1.0 - core);
  return vec3f(beam, rim, along);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let world = uv * vec2f(16.0, 9.0);
  let wave = sampleWaves(world, params.time * 1.15, params.windAngle, params.windSpeed, params.quality);
  let chopOct = select(2, 4, params.quality > 0.5);
  let chop = fbmSimplex2d(
    world * 0.55 + vec2f(params.time * 0.22, params.time * 0.05),
    chopOct,
    2.17,
    0.5,
  );

  let n = wave.normal;
  let height = wave.displacement.y;
  let beamParts = beamMask(uv, n, height);
  let beam = beamParts.x;
  let rim = beamParts.y;
  let along = beamParts.z;

  let viewDir = vec3f(0.0, 1.0, 0.0);
  let lightDir = normalize(vec3f(params.beamDir.x, 0.38, params.beamDir.y));
  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(WATER_IOR, facing);
  let spec = blinnSpecular(n, viewDir, lightDir, mix(140.0, 380.0, params.quality));
  let foam = smoothstep(0.72, 0.2, wave.jacobian) * (0.35 + 0.65 * chop);

  // Wave facets thicken the optical path, so the plate warps like real water
  // and the white beam splits further from the boat — same idea as the
  // homepage prism / transmission cube.
  let thickness = 0.045 + abs(height) * 0.045 + beam * 0.04;
  let count = select(3, 5, params.quality > 0.5);
  var spectrum = vec3f(0.0);
  var total = vec3f(0.0);
  for (var i = 0; i < 5; i++) {
    if (i >= count) { break; }
    let t = (f32(i) + 0.5) / f32(count);
    let spectralIor = max(1.0, WATER_IOR + (t - 0.5) * DISPERSION);
    let offset = waterRefractOffset(n, 1.0 / spectralIor, thickness);
    let weight = spectralWeight(t);
    spectrum += samplePlate(uv + offset) * weight;
    total += weight;
  }
  var transmitted = spectrum / max(total, vec3f(1.0e-4));

  let deep = vec3f(0.003, 0.012, 0.04);
  let shallow = vec3f(0.025, 0.07, 0.13);
  let water = mix(deep, shallow, pow(facing, 0.45));
  transmitted = mix(water, transmitted, 0.78);

  let body = smoothstep(0.16, 0.035, luma(transmitted));
  let trough = clamp(1.0 - facing, 0.0, 1.0);
  transmitted *= mix(1.0, 0.7, body * (1.0 - beam * 0.5));
  transmitted += vec3f(0.06, 0.14, 0.26) * body * beam * trough * 0.2;

  let reflection = vec3f(0.006, 0.016, 0.038) + vec3f(0.9, 0.96, 1.0) * spec * beam * 1.8;
  var col = mix(transmitted, reflection, mix(0.05, 0.72, fres));

  col += vec3f(0.62, 0.86, 1.0) * foam * beam * 0.55;
  col += vec3f(0.2, 0.45, 0.85) * beam * (0.06 + 0.28 * fres);

  let dir = normalize(params.beamDir);
  let aspect = viewSize().y / max(viewSize().x, 1.0);
  let perp = vec2f(-dir.y, dir.x);
  let facet = length(n.xz);
  let split = along * (0.01 + 0.055 * facet) * rim;
  let prismR = samplePlate(uv + waterRefractOffset(n, 1.0 / (WATER_IOR - 0.03), thickness) + perp * split);
  let prismB = samplePlate(uv + waterRefractOffset(n, 1.0 / (WATER_IOR + 0.03), thickness) - perp * split);
  col.r += (prismR.r - transmitted.r) * rim * 0.85;
  col.b += (prismB.b - transmitted.b) * rim * 0.85;
  col += spectralWeight(clamp(along * 0.55 + facet * 0.35, 0.0, 1.0)) * rim * (0.16 + 0.45 * facet);

  let haze = beam * (1.0 - smoothstep(0.0, 0.85, max(along, 0.0))) * 0.1;
  col += vec3f(0.7, 0.84, 1.0) * haze;

  let grain = fbmSimplex2d(uv * 26.0 + vec2f(params.time * 0.04, 0.0), 2, 2.0, 0.5);
  col += grain * 0.008;

  let vignette = 1.0 - 0.26 * dot(uv - vec2f(0.5), uv - vec2f(0.5));
  col *= vignette;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
