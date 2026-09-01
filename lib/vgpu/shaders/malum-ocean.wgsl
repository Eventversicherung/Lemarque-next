import { dielectricFresnel } from "./lighting.wgsl";
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

fn beamMask(uv: vec2f) -> f32 {
  let dir = normalize(params.beamDir);
  let origin = params.boatUv;
  let aspect = viewSize().y / max(viewSize().x, 1.0);
  let toPoint = (uv - origin) * vec2f(1.0, aspect);
  let along = dot(toPoint, dir);
  let side = abs(dot(toPoint, vec2f(-dir.y, dir.x)));
  let width = 0.012 + along * 0.16;
  let cone = 1.0 - smoothstep(width, width + 0.035, side);
  let shaft = smoothstep(-0.012, 0.02, along) * (1.0 - smoothstep(0.52, 0.92, along));
  return clamp(cone * shaft, 0.0, 1.0);
}

fn samplePlate(uv: vec2f) -> vec3f {
  let mapped = coverUv(uv);
  let inside = all(mapped >= vec2f(0.0)) && all(mapped <= vec2f(1.0));
  let texel = textureSampleLevel(plate, samp, clamp(mapped, vec2f(0.0), vec2f(1.0)), 0.0).rgb;
  return select(vec3f(0.004, 0.012, 0.03), texel, inside);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let world = uv * vec2f(22.0, 12.0);
  let wave = sampleWaves(world, params.time, params.windAngle, params.windSpeed, params.quality);
  let chop = fbmSimplex2d(world * 0.35 + vec2f(params.time * 0.12, 0.0), 3, 2.17, 0.5);

  let beam = beamMask(uv);
  let n = wave.normal;
  let plateUv = uv + n.xz * mix(0.006, 0.03, beam);
  var col = samplePlate(plateUv);

  col *= vec3f(0.7, 0.84, 1.1);
  col = mix(col, vec3f(0.008, 0.02, 0.055), 0.16);

  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(1.333, facing);
  let foam = smoothstep(0.62, 0.18, wave.jacobian) * (0.55 + 0.45 * chop);

  let breakHi = vec3f(0.62, 0.82, 1.0);
  col += breakHi * foam * beam * 0.6;
  col += vec3f(0.22, 0.4, 0.78) * beam * (0.1 + 0.28 * fres);
  col += vec3f(0.85, 0.93, 1.0) * pow(max(-n.x, 0.0), 6.0) * beam * 0.28;

  let grain = fbmSimplex2d(uv * 22.0 + vec2f(params.time * 0.03, 0.0), 2, 2.0, 0.5);
  col += grain * 0.008;

  let vignette = 1.0 - 0.22 * dot(uv - vec2f(0.5), uv - vec2f(0.5));
  col *= vignette;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
