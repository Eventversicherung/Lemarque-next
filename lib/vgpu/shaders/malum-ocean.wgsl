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
  let scale = max(view.x / max(tex.x, 1.0), view.y / max(tex.y, 1.0));
  let crop = view / (tex * scale);
  let half = crop * 0.5;
  var center = vec2f(0.5, 0.5);
  if (crop.x < 0.92) {
    let look = vec2f(0.36, 0.66);
    center.x = clamp(look.x, half.x, 1.0 - half.x);
    center.y = clamp(look.y, half.y, 1.0 - half.y);
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

fn lampA() -> vec2f {
  return params.boatUv;
}

fn lampB() -> vec2f {
  return params.boatUv + vec2f(-0.0065, -0.005);
}

fn rot2(v: vec2f, a: f32) -> vec2f {
  let c = cos(a);
  let s = sin(a);
  return vec2f(c * v.x - s * v.y, s * v.x + c * v.y);
}

fn toLamp(plateUv: vec2f, origin: vec2f) -> vec2f {
  return (plateUv - origin) * vec2f(1.0, plateAspect());
}

fn lampLightDir(plateUv: vec2f, origin: vec2f) -> vec3f {
  let toPoint = toLamp(plateUv, origin);
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

fn contactShadow(plateUv: vec2f, rock: vec2f) -> f32 {
  let a = boatAxes(plateUv);
  let e = vec2f((a.x - 0.03 + rock.x * 0.01) / 0.1, (a.y + rock.y * 0.007) / 0.052);
  return 1.0 - smoothstep(0.42, 1.18, length(e));
}

fn beamMaskAt(plateUv: vec2f, origin: vec2f, dir0: vec2f, n: vec3f, rock: vec2f) -> f32 {
  let dir = normalize(dir0);
  let toPoint = toLamp(plateUv, origin) + n.xz * 0.02;
  let along = dot(toPoint, dir);
  let side = abs(dot(toPoint, vec2f(-dir.y, dir.x)));
  let width = 0.013 + along * 0.132 + n.x * 0.012 + rock.x * 0.004;
  let cone = 1.0 - smoothstep(width * 0.14, width + 0.042, side);
  let shaft = smoothstep(-0.02, 0.04, along) * (1.0 - smoothstep(0.92, 1.38, along));
  return clamp(cone * shaft, 0.0, 1.0);
}

fn originHalo(plateUv: vec2f, origin: vec2f, rock: vec2f) -> f32 {
  let p = toLamp(plateUv, origin) - rock * 0.002;
  let r2 = dot(p, p);
  return exp(-r2 * 420.0) * 0.55 + exp(-r2 * 2200.0) * 0.35;
}

fn boatRock(t: f32) -> vec2f {
  let oct = select(1, 2, params.quality > 0.75);
  return vec2f(
    fbmSimplex2d(vec2f(t * 0.12, 2.6), oct, 2.08, 0.5),
    fbmSimplex2d(vec2f(t * 0.08 + 3.1, 0.4), 1, 2.05, 0.5),
  );
}

fn searchSway(t: f32, seed: f32) -> f32 {
  let oct = select(1, 2, params.quality > 0.75);
  let slow = fbmSimplex2d(vec2f(t * 0.048 + seed, seed * 1.7), oct, 2.02, 0.52);
  let nod = fbmSimplex2d(vec2f(t * 0.031 + seed * 0.4, 4.8), 1, 2.04, 0.5);
  return slow * 0.72 + nod * 0.28;
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

  let rockA = boatRock(params.time);
  let rockB = boatRock(params.time + 19.0);
  let originA = lampA();
  let originB = lampB();
  let yawA = searchSway(params.time, 1.4) * 0.058;
  let yawB = searchSway(params.time, 6.9) * 0.064;
  let dirA = rot2(params.beamDir, 0.016 + yawA);
  let dirB = rot2(params.beamDir, -0.02 + yawB);
  let beamA = beamMaskAt(plateUv, originA, dirA, n, rockA);
  let beamB = beamMaskAt(plateUv, originB, dirB, n, rockB);
  let beam = max(beamA, beamB);
  let lamp = smoothstep(0.55, 0.92, bodyL);
  let deep = smoothstep(0.14, 0.03, bodyL);
  let swim = vec2f(sin(params.time * 0.05), cos(params.time * 0.038)) * 0.004 * deep * water;

  let thickness = (0.014 + abs(height) * 0.022 + beam * 0.008) * water;
  let warp = (waterRefractOffset(n, 1.0 / WATER_IOR, thickness) + wave.displacement.xz * 0.008 + swim) * water;
  var col = sampleMapped(toPlate(uv + warp, cov));
  col = mix(col, bodyProbe, hull);

  let painted = smoothstep(0.04, 0.15, luma(col));
  let lit = clamp(painted * 1.08 + beam * painted * 0.55, 0.0, 1.0);
  let shaft = max(painted, max(beamA * 0.52, beamB * 0.78));
  let split = beamB / max(beamA + beamB, 1.0e-4);

  let lightDir = normalize(
    lampLightDir(plateUv, originA) * (0.55 + beamA) +
    lampLightDir(plateUv, originB) * (0.45 + beamB),
  );
  let nDotL = max(dot(n, lightDir), 0.0);
  let viewDir = vec3f(0.0, 1.0, 0.0);
  let specWide = blinnSpecular(n, viewDir, lightDir, 42.0);
  let specTight = blinnSpecular(n, viewDir, lightDir, mix(70.0, 120.0, params.quality));
  let spec = mix(specWide * 0.48, specTight, 0.58) * water;
  let chopOct = select(1, 2, params.quality > 0.75);
  let chop = fbmSimplex2d(world * 0.55 + vec2f(params.time * 0.07, 0.0), chopOct, 2.12, 0.5);
  let foam = smoothstep(0.72, 0.22, wave.jacobian) * (0.25 + 0.75 * max(chop, 0.0)) * crest * water;
  let cau = pow(max(chop * 0.5 + 0.5, 0.0), 3.4) * (0.35 + 0.65 * nDotL);

  let xenon = vec3f(0.98, 0.93, 0.86);
  let carbon = vec3f(1.0, 0.76, 0.42);
  let lightCol = mix(xenon, carbon, 0.4 + 0.48 * split);
  let seaGain = mix(
    0.86,
    1.16,
    clamp(
      0.5 + 0.3 * rockA.x + 0.16 * rockB.y + 0.28 * (nDotL - 0.32) + 0.14 * crest,
      0.0,
      1.0,
    ),
  );
  let trough = smoothstep(0.1, -0.14, height);
  col *= mix(vec3f(1.0), vec3f(1.0, 0.93, 0.8), shaft * 0.2);
  col += xenon * beamA * water * (0.028 + 0.05 * cau * through + 0.12 * spec * over) * seaGain;
  col += carbon * beamB * water * (0.048 + 0.07 * cau * through + 0.16 * spec * over) * seaGain;
  col += lightCol * painted * water * (0.03 + 0.07 * cau * through + 0.16 * spec * over) * seaGain;
  col += mix(xenon, carbon, 0.5 + 0.42 * split) * spec * nDotL * over * shaft * water * 0.26 * seaGain;
  col += vec3f(0.82, 0.88, 0.92) * foam * lit * 0.1;
  col += vec3f(0.22, 0.3, 0.42) * cau * facing * shaft * through * water * (0.05 + 0.05 * trough) * seaGain;
  col += vec3f(0.1, 0.16, 0.24) * fres * (1.0 - facing) * water * 0.05;

  let halo = originHalo(plateUv, originA, rockA) * mix(xenon, carbon, 0.35) * 0.16
    + originHalo(plateUv, originB, rockB) * carbon * 0.2;
  let nearA = 1.0 - smoothstep(0.0, 0.14, dot(toLamp(plateUv, originA), dirA));
  let nearB = 1.0 - smoothstep(0.0, 0.14, dot(toLamp(plateUv, originB), dirB));
  let wash = (nearA * beamA * xenon * 0.08 + nearB * beamB * carbon * 0.13) * (0.7 + 0.3 * seaGain);
  col += (halo * (0.55 + 0.45 * hull) + wash * water) * (0.85 + 0.15 * seaGain);

  let hullBody = hull * (1.0 - lamp);
  let occ = (1.0 - hull) * hush * (1.0 - lamp);
  col *= 1.0 - contactShadow(plateUv, rockA) * (1.0 - lamp) * (1.0 - shaft * 0.45) * (0.48 + rockA.x * 0.07);
  col *= 1.0 - occ * (1.0 - shaft * 0.62) * 0.26;
  let lee = clamp(0.46 - nDotL, 0.0, 1.0) * water * (1.0 - lamp);
  col *= 1.0 - lee * mix(0.13, 0.035, shaft);
  col += vec3f(0.12, 0.15, 0.18) * hullBody * 0.22;
  col += vec3f(0.22, 0.26, 0.3) * hullBody * (0.1 + 0.16 * facing);

  col *= mix(1.0, 0.88, deep * (1.0 - shaft * 0.45) * live);
  col += vec3f(0.05, 0.12, 0.22) * deep * through * shaft * cau * water * 0.14 * seaGain;

  let cloud = fbmSimplex2d(uv * 0.42 + vec2f(params.time * 0.0055, params.time * 0.0032), 2, 2.0, 0.55);
  let cloudShadow = smoothstep(-0.28, 0.5, cloud);
  col *= 1.0 - cloudShadow * (1.0 - hull) * mix(0.38, 0.12, shaft);

  let vigC = uv - vec2f(0.52, 0.44);
  let vigR = length(vigC * vec2f(1.05, 1.15));
  col *= 1.0 - smoothstep(0.34, 1.05, vigR) * 0.24 * (1.0 - hull);

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
