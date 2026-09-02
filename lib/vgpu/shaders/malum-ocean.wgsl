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

struct Cover {
  crop: vec2f,
  center: vec2f,
}

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var plate: texture_2d<f32>;
@group(0) @binding(2) var samp: sampler;

fn coverOf() -> Cover {
  let tex = vec2f(textureDimensions(plate));
  let view = 1.0 / max(params.texel, vec2f(1.0e-5));
  var scale = max(view.x / max(tex.x, 1.0), view.y / max(tex.y, 1.0));
  var crop = view / (tex * scale);
  if (crop.x < 0.92) {
    scale *= 1.24;
    crop = view / (tex * scale);
  }
  let half = crop * 0.5;
  var center = vec2f(0.5, 0.5);
  if (crop.x < 1.0) {
    let lookX = params.boatUv.x - 0.04;
    center.x = clamp(lookX, half.x, 1.0 - half.x);
  }
  if (crop.y < 1.0) {
    let lookY = params.boatUv.y + 0.11;
    center.y = clamp(lookY, half.y, 1.0 - half.y);
  }
  return Cover(crop, center);
}

fn toPlate(uv: vec2f, cov: Cover) -> vec2f {
  return (uv - 0.5) * cov.crop + cov.center;
}

fn sampleMapped(mapped: vec2f) -> vec3f {
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

fn toBoat(plateUv: vec2f) -> vec2f {
  return (plateUv - params.boatUv) * vec2f(1.0, plateAspect());
}

fn lampLightDir(plateUv: vec2f) -> vec3f {
  let toPoint = toBoat(plateUv);
  return normalize(vec3f(toPoint.x, 0.32, toPoint.y));
}

fn boatAxes(plateUv: vec2f) -> vec2f {
  let p = toBoat(plateUv);
  let dir = normalize(params.beamDir);
  return vec2f(dot(p, dir), dot(p, vec2f(-dir.y, dir.x)));
}

fn hullMask(plateUv: vec2f) -> f32 {
  let a = boatAxes(plateUv);
  let e = vec2f((a.x + 0.004) / 0.082, a.y / 0.05);
  return 1.0 - smoothstep(0.48, 1.12, length(e));
}

fn hushMask(plateUv: vec2f) -> f32 {
  let a = boatAxes(plateUv);
  let e = vec2f((a.x + 0.006) / 0.092, a.y / 0.052);
  return 1.0 - smoothstep(0.48, 1.12, length(e));
}

fn contactShadow(plateUv: vec2f) -> f32 {
  let a = boatAxes(plateUv);
  let e = vec2f((a.x - 0.03) / 0.1, a.y / 0.052);
  return 1.0 - smoothstep(0.42, 1.18, length(e));
}

fn beamMask(plateUv: vec2f, n: vec3f) -> f32 {
  let dir = normalize(params.beamDir);
  let toPoint = toBoat(plateUv) + n.xz * 0.02;
  let along = dot(toPoint, dir);
  let side = abs(dot(toPoint, vec2f(-dir.y, dir.x)));
  let width = 0.02 + along * 0.17 + n.x * 0.012;
  let cone = 1.0 - smoothstep(width * 0.18, width + 0.05, side);
  let shaft = smoothstep(-0.02, 0.04, along) * (1.0 - smoothstep(0.92, 1.38, along));
  return clamp(cone * shaft, 0.0, 1.0);
}

fn worldScale(uv: vec2f) -> vec2f {
  return uv * vec2f(26.0, 17.0);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let cov = coverOf();
  let plateUv = toPlate(uv, cov);
  let hull = hullMask(plateUv);
  let hush = hushMask(plateUv);
  let live = 1.0 - hull;
  let water = live * (1.0 - hush * 0.5);

  let bodyProbe = sampleMapped(plateUv);
  let bodyL = luma(bodyProbe);
  let plateN = normalize(vec3f(-dpdx(bodyL) * 80.0, 1.0, -dpdy(bodyL) * 80.0));

  let world = worldScale(uv);
  let wave = sampleWaves(world, params.time * 0.42, params.windAngle, params.windSpeed, params.quality);
  var n = normalize(vec3f(
    plateN.x + wave.normal.x * 0.62 * water,
    max(plateN.y * 0.58 + wave.normal.y * 0.48, 0.22),
    plateN.z + wave.normal.z * 0.62 * water,
  ));
  n = mix(vec3f(0.0, 1.0, 0.0), n, 0.18 + 0.82 * water);
  if (params.quality > 0.75) {
    let micro = fbmSimplex2d(world * 3.1 + vec2f(params.time * 0.045, 0.2), 1, 2.1, 0.5);
    n = normalize(vec3f(n.x + micro * 0.06 * water, n.y, n.z + micro * 0.05 * water));
  }

  let height = wave.displacement.y;
  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(WATER_IOR, facing);
  let crest = smoothstep(-0.05, 0.16, height);
  let over = clamp(crest * mix(0.22, 0.9, fres), 0.0, 1.0);
  let through = 1.0 - over;

  let beam = beamMask(plateUv, n);
  let lamp = smoothstep(0.55, 0.92, bodyL);
  let deep = smoothstep(0.14, 0.03, bodyL);
  let swim = vec2f(sin(params.time * 0.05), cos(params.time * 0.038)) * 0.004 * deep * water;

  let thickness = (0.014 + abs(height) * 0.022 + beam * 0.008) * water;
  let warp = (waterRefractOffset(n, 1.0 / WATER_IOR, thickness) + wave.displacement.xz * 0.008 + swim) * water;
  var col = sampleMapped(toPlate(uv + warp, cov));
  col = mix(col, bodyProbe, hull);

  let painted = smoothstep(0.04, 0.15, luma(col));
  let lit = clamp(painted * 1.08 + beam * painted * 0.55, 0.0, 1.0);
  let shaft = max(painted, beam * 0.65);

  let lightDir = lampLightDir(plateUv);
  let nDotL = max(dot(n, lightDir), 0.0);
  let viewDir = vec3f(0.0, 1.0, 0.0);
  let specWide = blinnSpecular(n, viewDir, lightDir, 48.0);
  let specTight = blinnSpecular(n, viewDir, lightDir, mix(80.0, 140.0, params.quality));
  let spec = mix(specWide * 0.45, specTight, 0.62) * water;
  let chopOct = select(1, 2, params.quality > 0.75);
  let chop = fbmSimplex2d(world * 0.55 + vec2f(params.time * 0.07, 0.0), chopOct, 2.12, 0.5);
  let foam = smoothstep(0.72, 0.22, wave.jacobian) * (0.25 + 0.75 * max(chop, 0.0)) * crest * water;
  let cau = pow(max(chop * 0.5 + 0.5, 0.0), 3.4) * (0.35 + 0.65 * nDotL);

  let cool = vec3f(0.9, 0.95, 1.0);
  col += cool * shaft * water * (0.04 + 0.08 * cau * through + 0.2 * spec * over);
  col += vec3f(0.96, 0.98, 1.0) * spec * nDotL * over * shaft * water * 0.26;
  col += vec3f(0.8, 0.9, 0.97) * foam * lit * 0.1;
  col += vec3f(0.18, 0.32, 0.48) * cau * facing * shaft * through * water * 0.06;
  col += vec3f(0.1, 0.16, 0.24) * fres * (1.0 - facing) * water * 0.05;

  let hullBody = hull * (1.0 - lamp);
  let occ = (1.0 - hull) * hush * (1.0 - lamp);
  col *= 1.0 - contactShadow(plateUv) * (1.0 - lamp) * (1.0 - shaft * 0.45) * 0.48;
  col *= 1.0 - occ * (1.0 - shaft * 0.62) * 0.26;
  col += vec3f(0.12, 0.15, 0.18) * hullBody * 0.22;
  col += vec3f(0.22, 0.26, 0.3) * hullBody * (0.1 + 0.16 * facing);

  col *= mix(1.0, 0.88, deep * (1.0 - shaft * 0.45) * live);
  col += vec3f(0.05, 0.12, 0.22) * deep * through * shaft * cau * water * 0.14;

  let cloud = fbmSimplex2d(uv * 0.42 + vec2f(params.time * 0.0055, params.time * 0.0032), 2, 2.0, 0.55);
  let cloudShadow = smoothstep(-0.28, 0.5, cloud);
  col *= 1.0 - cloudShadow * (1.0 - hull) * mix(0.38, 0.12, shaft);

  let vigC = uv - vec2f(0.52, 0.44);
  let vigR = length(vigC * vec2f(1.05, 1.15));
  col *= 1.0 - smoothstep(0.34, 1.05, vigR) * 0.24 * (1.0 - hull);

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
