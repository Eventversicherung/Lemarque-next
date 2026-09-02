import { blinnSpecular, dielectricFresnel, spectralWeight, waterRefractOffset } from "./lighting.wgsl";
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
  // Nadir plate: no horizon. Portrait keeps the lamp in frame.
  // Landscape looks a little down the beam so the serpent stays visible
  // without gluing the boat to the top edge.
  let dir = normalize(params.beamDir);
  let alongFocus = select(0.18, 0.1, crop.x < 0.92);
  let focus = params.boatUv + dir * alongFocus;
  let half = crop * 0.5;
  let center = clamp(focus, half, vec2f(1.0) - half);
  return (uv - 0.5) * crop + center;
}

fn samplePlate(uv: vec2f) -> vec3f {
  let mapped = coverUv(uv);
  let inside = all(mapped >= vec2f(0.0)) && all(mapped <= vec2f(1.0));
  let texel = textureSampleLevel(plate, samp, clamp(mapped, vec2f(0.0), vec2f(1.0)), 0.0).rgb;
  return select(vec3f(0.01, 0.025, 0.045), texel, inside);
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

// Geometric cone in plate UV. Origin stays on the painted lamp; a tiny
// sway only walks caustics along the shaft so the still and the live
// cone do not split into two lights.
fn beamCone(plateUv: vec2f, n: vec3f, height: f32) -> vec3f {
  let sway = vec2f(sin(params.time * 0.11) * 0.018, cos(params.time * 0.09) * 0.012);
  let dir = normalize(params.beamDir + sway);
  let toPoint = (plateUv - params.boatUv + n.xz * 0.018) * vec2f(1.0, plateAspect());
  let along = dot(toPoint, dir);
  let side = abs(dot(toPoint, vec2f(-dir.y, dir.x)));
  let width = 0.02 + along * 0.2 + height * 0.03;
  let cone = 1.0 - smoothstep(width * 0.15, width + 0.04, side);
  let shaft = smoothstep(-0.02, 0.04, along) * (1.0 - smoothstep(0.95, 1.45, along));
  let beam = clamp(cone * shaft, 0.0, 1.0);
  let rim = beam * smoothstep(width * 0.12, width, side);
  return vec3f(beam, rim, along);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let world = uv * vec2f(16.0, 9.0);
  let wave = sampleWaves(world, params.time * 0.82, params.windAngle, params.windSpeed, params.quality);
  let n = wave.normal;
  let height = wave.displacement.y;
  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(WATER_IOR, facing);

  let crest = smoothstep(-0.08, 0.2, height);
  let trough = 1.0 - crest;
  let over = clamp(crest * mix(0.25, 1.0, fres), 0.0, 1.0);
  let through = 1.0 - over;

  let plateUv = coverUv(uv);
  let cone = beamCone(plateUv, n, height);
  let beam = cone.x;
  let rim = cone.y;
  let along = cone.z;
  let dir = normalize(params.beamDir);
  let tangent = vec2f(-dir.y, dir.x);

  // Slow "through water" drift on the dark mass. Not a 3D shark — just
  // the plate sliding under a thicker refracted layer.
  let bodyProbe = samplePlate(uv);
  let deep = smoothstep(0.16, 0.035, luma(bodyProbe));
  let swim = vec2f(sin(params.time * 0.07), cos(params.time * 0.055)) * 0.014 * deep;

  let thickness = 0.04 + abs(height) * 0.055 + beam * 0.03 + deep * 0.02;
  let count = select(3, 5, params.quality > 0.7);
  var spectrum = vec3f(0.0);
  var total = vec3f(0.0);
  for (var i = 0; i < 5; i++) {
    if (i >= count) { break; }
    let t = (f32(i) + 0.5) / f32(count);
    let spectralIor = max(1.0, WATER_IOR + (t - 0.5) * mix(0.06, 0.14, through));
    let snell = waterRefractOffset(n, 1.0 / spectralIor, thickness);
    // Extra lateral split along the wave tangent so white light fans like
    // the transmission example's spectralWeight lobes — the prism fake.
    let split = tangent * (t - 0.5) * mix(0.01, 0.055, through) * (0.35 + beam);
    let weight = spectralWeight(t);
    spectrum += samplePlate(uv + snell + split + swim) * weight;
    total += weight;
  }
  var col = spectrum / max(total, vec3f(1.0e-4));

  // Unsharp underwater layer: a second, thicker sample mixed into the mass.
  let blur = samplePlate(uv + n.xz * 0.03 + swim * 1.6);
  col = mix(col, blur, deep * (0.35 + 0.25 * trough));

  let painted = smoothstep(0.045, 0.16, luma(col));
  let lit = max(painted, beam);

  let lightDir = lampLightDir(plateUv);
  let nDotL = max(dot(n, lightDir), 0.0);
  let viewDir = vec3f(0.0, 1.0, 0.0);
  let spec = blinnSpecular(n, viewDir, lightDir, mix(90.0, 280.0, params.quality));
  let chop = fbmSimplex2d(world * 0.42 + vec2f(params.time * 0.22, params.time * 0.05), 3, 2.15, 0.5);
  let foam = smoothstep(0.72, 0.18, wave.jacobian) * (0.3 + 0.7 * chop);
  let cau = pow(max(chop * 0.55 + 0.45, 0.0), 2.4);

  // Crests throw white light back; troughs take it under and split color.
  let prism = spectralWeight(clamp(0.28 + height * 1.6 + n.x * 0.55 + along * 0.15, 0.0, 1.0));
  let beamCol = mix(vec3f(0.9, 0.96, 1.0), prism, through * 0.75);

  // The still is a night plate — lift and add the cone so the beam reads
  // as a shaft, not a 2% overlay on crushed navy.
  col = mix(col, col * 1.75 + beamCol * 0.28, lit * 0.78);
  col += beamCol * beam * (0.32 + 0.58 * cau * through + 0.95 * spec * over);
  col += (prism - vec3f(0.33)) * rim * (0.55 + 0.4 * through);
  col += vec3f(0.95, 0.98, 1.0) * spec * nDotL * over * lit * 0.9;
  col += vec3f(0.78, 0.9, 1.0) * foam * lit * 0.55;
  col += vec3f(0.28, 0.62, 1.0) * cau * facing * lit * 0.35;

  // Looking down through water at the beast: darker, slower, a little
  // light walking the silhouette when a trough lets the cone through.
  col *= mix(1.0, 0.72, deep * (1.0 - lit * 0.55));
  col += vec3f(0.08, 0.2, 0.4) * deep * through * lit * (0.25 + 0.75 * cau);
  col += vec3f(0.12, 0.28, 0.48) * deep * beam * trough * 0.22;

  let haze = beam * (1.0 - smoothstep(0.0, 0.85, max(along, 0.0)));
  col += vec3f(0.7, 0.86, 1.0) * haze * 0.3;

  let grain = fbmSimplex2d(uv * 20.0 + vec2f(params.time * 0.03, 0.0), 2, 2.0, 0.5);
  col += grain * 0.01;

  let vignette = 1.0 - 0.16 * dot(uv - vec2f(0.5), uv - vec2f(0.5));
  col *= vignette;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
