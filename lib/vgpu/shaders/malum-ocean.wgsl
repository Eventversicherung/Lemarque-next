import { blinnSpecular, dielectricFresnel } from "./lighting.wgsl";
import { sampleWaves } from "./waves.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

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

fn beamMask(uv: vec2f, n: vec3f, height: f32) -> f32 {
  let dir = normalize(params.beamDir);
  let origin = params.boatUv;
  let aspect = viewSize().y / max(viewSize().x, 1.0);
  let warped = uv + n.xz * vec2f(0.02, 0.02 / max(aspect, 0.2));
  let toPoint = (warped - origin) * vec2f(1.0, aspect);
  let along = dot(toPoint, dir);
  let side = abs(dot(toPoint, vec2f(-dir.y, dir.x)));
  let width = 0.01 + along * 0.145 + height * 0.014;
  let cone = 1.0 - smoothstep(width, width + 0.05 + abs(height) * 0.025, side);
  let shaft = smoothstep(-0.02, 0.035, along) * (1.0 - smoothstep(0.78, 1.22, along));
  let core = 1.0 - smoothstep(width * 0.28, width * 0.9, side);
  return clamp(cone * shaft, 0.0, 1.0) * mix(0.5, 1.0, core);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let world = uv * vec2f(36.0, 20.0);
  let wave = sampleWaves(world, params.time, params.windAngle, params.windSpeed, params.quality);
  let chopOct = select(2, 4, params.quality > 0.5);
  let chop = fbmSimplex2d(
    world * 0.42 + vec2f(params.time * 0.18, params.time * 0.04),
    chopOct,
    2.17,
    0.5,
  );

  let n = wave.normal;
  let height = wave.displacement.y;
  let beam = beamMask(uv, n, height);

  let plateUv = uv + n.xz * mix(0.008, 0.04, beam) + vec2f(height * 0.005);
  var col = samplePlate(plateUv);

  col *= vec3f(0.62, 0.82, 1.12);
  col = mix(col, vec3f(0.006, 0.016, 0.045), 0.18);

  let viewDir = vec3f(0.0, 1.0, 0.0);
  let lightDir = normalize(vec3f(params.beamDir.x, 0.42, params.beamDir.y));
  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(1.333, facing);
  let spec = blinnSpecular(n, viewDir, lightDir, mix(180.0, 420.0, params.quality));
  let foam = smoothstep(0.68, 0.22, wave.jacobian) * (0.4 + 0.6 * chop);

  let cauUv = world * 0.9 + n.xz * 3.2 + vec2f(params.time * 0.35, -params.time * 0.12);
  let cau = fbmSimplex2d(cauUv, select(2, 3, params.quality > 0.5), 2.1, 0.55);
  let caustic = pow(max(cau * 0.5 + 0.5, 0.0), 5.0) * beam * facing;

  let trough = clamp(1.0 - facing, 0.0, 1.0);
  let body = smoothstep(0.16, 0.035, luma(col));
  col *= mix(1.0, 0.72, body * (1.0 - beam * 0.55));
  col += vec3f(0.07, 0.16, 0.28) * body * beam * trough * 0.22;

  col += vec3f(0.55, 0.78, 1.0) * foam * beam * 0.72;
  col += vec3f(0.75, 0.9, 1.0) * spec * beam * 1.35;
  col += vec3f(0.18, 0.42, 0.82) * beam * (0.08 + 0.32 * fres);
  col += vec3f(0.45, 0.78, 1.0) * caustic * 0.55;
  col += vec3f(0.22, 0.38, 0.7) * beam * trough * 0.12;

  let dir = normalize(params.beamDir);
  let aspect = viewSize().y / max(viewSize().x, 1.0);
  let toPoint = (uv - params.boatUv) * vec2f(1.0, aspect);
  let along = max(dot(toPoint, dir), 0.0);
  let haze = beam * (1.0 - smoothstep(0.0, 0.85, along)) * 0.12;
  col += vec3f(0.55, 0.72, 0.95) * haze;

  let grain = fbmSimplex2d(uv * 28.0 + vec2f(params.time * 0.04, 0.0), 2, 2.0, 0.5);
  col += grain * 0.01;

  let vignette = 1.0 - 0.28 * dot(uv - vec2f(0.5), uv - vec2f(0.5));
  col *= vignette;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
