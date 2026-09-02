import { blinnSpecular, dielectricFresnel, waterRefractOffset } from "./lighting.wgsl";
import { sampleWaves } from "./waves.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

const WATER_IOR: f32 = 1.333;

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

fn coverUv(uv: vec2f) -> vec2f {
  let tex = vec2f(textureDimensions(plate));
  let view = 1.0 / max(params.texel, vec2f(1.0e-5));
  let scale = max(view.x / max(tex.x, 1.0), view.y / max(tex.y, 1.0));
  let crop = view / (tex * scale);
  let half = crop * 0.5;
  var center = vec2f(0.5, 0.5);
  if (crop.x < 1.0) {
    center.x = clamp(params.boatUv.x, half.x, 1.0 - half.x);
  }
  if (crop.y < 1.0) {
    center.y = clamp(0.5, half.y, 1.0 - half.y);
  }
  return (uv - 0.5) * crop + center;
}

fn samplePlate(uv: vec2f) -> vec3f {
  let mapped = coverUv(uv);
  let inside = all(mapped >= vec2f(0.0)) && all(mapped <= vec2f(1.0));
  let texel = textureSampleLevel(plate, samp, clamp(mapped, vec2f(0.0), vec2f(1.0)), 0.0).rgb;
  return select(vec3f(0.008, 0.02, 0.04), texel, inside);
}

fn luma(c: vec3f) -> f32 {
  return dot(c, vec3f(0.2126, 0.7152, 0.0722));
}

fn plateAspect() -> f32 {
  let tex = vec2f(textureDimensions(plate));
  return tex.y / max(tex.x, 1.0);
}

fn lampLightDir(plateUv: vec2f) -> vec3f {
  let toPoint = (plateUv - params.boatUv) * vec2f(1.0, plateAspect());
  return normalize(vec3f(toPoint.x, 0.35, toPoint.y));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let world = uv * vec2f(14.0, 8.0);
  let wave = sampleWaves(world, params.time * 0.22, params.windAngle, params.windSpeed, params.quality);
  let n = wave.normal;
  let height = wave.displacement.y;
  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(WATER_IOR, facing);

  let crest = smoothstep(-0.04, 0.14, height);
  let over = clamp(crest * mix(0.2, 0.85, fres), 0.0, 1.0);
  let through = 1.0 - over;

  let plateUv = coverUv(uv);

  let bodyProbe = samplePlate(uv);
  let deep = smoothstep(0.14, 0.03, luma(bodyProbe));
  let swim = vec2f(sin(params.time * 0.045), cos(params.time * 0.035)) * 0.003 * deep;

  let thickness = 0.006 + abs(height) * 0.01;
  let offset = waterRefractOffset(n, 1.0 / WATER_IOR, thickness) + swim;
  var col = samplePlate(uv + offset);

  let painted = smoothstep(0.045, 0.15, luma(col));
  let gray = luma(col);
  col = mix(col, vec3f(gray) * vec3f(0.94, 0.97, 1.0), painted * 0.5);
  let lit = painted;

  let lightDir = lampLightDir(plateUv);
  let nDotL = max(dot(n, lightDir), 0.0);
  let viewDir = vec3f(0.0, 1.0, 0.0);
  let spec = blinnSpecular(n, viewDir, lightDir, mix(220.0, 420.0, params.quality));
  let chop = fbmSimplex2d(world * 0.35 + vec2f(params.time * 0.04, 0.0), 2, 2.1, 0.5);
  let foam = smoothstep(0.8, 0.32, wave.jacobian) * (0.2 + 0.75 * chop);
  let cau = pow(max(chop * 0.45 + 0.55, 0.0), 3.8);

  col += vec3f(0.9, 0.95, 1.0) * lit * (0.02 + 0.05 * cau * through + 0.1 * spec * over);
  col += vec3f(0.92, 0.96, 1.0) * spec * nDotL * over * lit * 0.08;
  col += vec3f(0.72, 0.82, 0.92) * foam * lit * 0.04;

  col *= mix(1.0, 0.92, deep * (1.0 - lit * 0.3));

  let grain = fbmSimplex2d(uv * 18.0 + vec2f(params.time * 0.01, 0.0), 2, 2.0, 0.5);
  col += grain * 0.003;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
