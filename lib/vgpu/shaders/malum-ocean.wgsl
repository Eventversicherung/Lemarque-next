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
  return normalize(vec3f(toPoint.x, 0.32, toPoint.y));
}

// Geometric cone in plate UV, locked to the painted lamp. Used as a
// lighting mask so sparkle and caustics live on the still's shaft.
fn beamMask(plateUv: vec2f, n: vec3f) -> f32 {
  let dir = normalize(params.beamDir);
  let toPoint = (plateUv - params.boatUv + n.xz * 0.01) * vec2f(1.0, plateAspect());
  let along = dot(toPoint, dir);
  let side = abs(dot(toPoint, vec2f(-dir.y, dir.x)));
  let width = 0.02 + along * 0.17;
  let cone = 1.0 - smoothstep(width * 0.18, width + 0.05, side);
  let shaft = smoothstep(-0.02, 0.04, along) * (1.0 - smoothstep(0.92, 1.38, along));
  return clamp(cone * shaft, 0.0, 1.0);
}

// Heightfield from the still so live normals follow the painted chop,
// not a second unrelated sea.
fn plateNormal(uv: vec2f) -> vec3f {
  let e = max(params.texel, vec2f(1.0e-4)) * 5.0;
  let hL = luma(samplePlate(uv - vec2f(e.x, 0.0)));
  let hR = luma(samplePlate(uv + vec2f(e.x, 0.0)));
  let hD = luma(samplePlate(uv - vec2f(0.0, e.y)));
  let hU = luma(samplePlate(uv + vec2f(0.0, e.y)));
  return normalize(vec3f((hL - hR) * 8.5, 1.0, (hD - hU) * 8.5));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let world = uv * vec2f(26.0, 17.0);
  let wave = sampleWaves(world, params.time * 0.48, params.windAngle, params.windSpeed, params.quality);
  let plateN = plateNormal(uv);
  var n = normalize(vec3f(
    plateN.x + wave.normal.x * 0.7,
    max(plateN.y * 0.55 + wave.normal.y * 0.5, 0.18),
    plateN.z + wave.normal.z * 0.7,
  ));
  let micro = vec2f(
    fbmSimplex2d(world * 3.8 + vec2f(params.time * 0.09, 0.2), 3, 2.15, 0.5),
    fbmSimplex2d(world * 3.8 + vec2f(1.7, params.time * 0.08), 3, 2.15, 0.5),
  );
  n = normalize(vec3f(n.x + (micro.x - 0.5) * 0.22, n.y, n.z + (micro.y - 0.5) * 0.22));

  let height = wave.displacement.y;
  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(WATER_IOR, facing);
  let crest = smoothstep(-0.05, 0.16, height);
  let over = clamp(crest * mix(0.22, 0.9, fres), 0.0, 1.0);
  let through = 1.0 - over;

  let plateUv = coverUv(uv);
  let beam = beamMask(plateUv, n);

  let bodyProbe = samplePlate(uv);
  let deep = smoothstep(0.14, 0.03, luma(bodyProbe));
  let swim = vec2f(sin(params.time * 0.05), cos(params.time * 0.038)) * 0.005 * deep;

  let thickness = 0.018 + abs(height) * 0.028 + beam * 0.01;
  let warp = waterRefractOffset(n, 1.0 / WATER_IOR, thickness) + wave.displacement.xz * 0.01 + swim;
  var col = samplePlate(uv + warp);

  let painted = smoothstep(0.04, 0.15, luma(col));
  let lit = clamp(painted * 1.08 + beam * painted * 0.55, 0.0, 1.0);
  let shaft = max(painted, beam * 0.65);

  let lightDir = lampLightDir(plateUv);
  let nDotL = max(dot(n, lightDir), 0.0);
  let viewDir = vec3f(0.0, 1.0, 0.0);
  let spec = blinnSpecular(n, viewDir, lightDir, mix(240.0, 560.0, params.quality));
  let chop = fbmSimplex2d(world * 0.55 + vec2f(params.time * 0.11, 0.0), 3, 2.12, 0.5);
  let foam = smoothstep(0.72, 0.22, wave.jacobian) * (0.25 + 0.75 * chop) * crest;
  let cau = pow(max(chop * 0.5 + 0.5, 0.0), 3.4) * (0.35 + 0.65 * nDotL);

  let cool = vec3f(0.9, 0.95, 1.0);
  col += cool * shaft * (0.05 + 0.12 * cau * through + 0.34 * spec * over);
  col += vec3f(0.96, 0.98, 1.0) * spec * nDotL * over * shaft * 0.5;
  col += vec3f(0.8, 0.9, 0.97) * foam * lit * 0.14;
  col += vec3f(0.18, 0.32, 0.48) * cau * facing * shaft * through * 0.08;
  col += vec3f(0.1, 0.16, 0.24) * fres * (1.0 - facing) * 0.07;

  col *= mix(1.0, 0.86, deep * (1.0 - shaft * 0.45));
  col += vec3f(0.05, 0.12, 0.22) * deep * through * shaft * cau * 0.18;

  let grain = fbmSimplex2d(uv * 22.0 + vec2f(params.time * 0.02, 0.0), 2, 2.0, 0.5);
  col += grain * 0.006;

  let vigC = uv - vec2f(0.52, 0.44);
  let vigR = length(vigC * vec2f(1.05, 1.15));
  col *= 1.0 - smoothstep(0.32, 1.02, vigR) * 0.3;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
