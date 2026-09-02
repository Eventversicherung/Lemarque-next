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

// Light at this pixel comes from the painted lamp, in plate UV so the
// cone cannot drift off the boat when the canvas aspect crops the still.
fn lampLightDir(plateUv: vec2f) -> vec3f {
  let tex = vec2f(textureDimensions(plate));
  let aspect = tex.y / max(tex.x, 1.0);
  let toPoint = (plateUv - params.boatUv) * vec2f(1.0, aspect);
  return normalize(vec3f(toPoint.x, 0.3, toPoint.y));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let world = uv * vec2f(14.0, 9.0);
  let wave = sampleWaves(world, params.time * 0.28, params.windAngle, params.windSpeed, params.quality);
  let n = wave.normal;
  let height = wave.displacement.y;
  let facing = max(n.y, 0.0);
  let fres = dielectricFresnel(WATER_IOR, facing);

  // Slow, small Snell warp — the plate is the scene under the surface.
  let thickness = 0.01 + abs(height) * 0.012;
  let offset = waterRefractOffset(n, 1.0 / WATER_IOR, thickness);
  var col = samplePlate(uv + offset);

  // Grazing faces only: a little RGB split, never a rainbow overlay.
  let graze = pow(1.0 - facing, 4.0);
  if (params.quality > 0.5) {
    let rOff = waterRefractOffset(n, 1.0 / 1.318, thickness);
    let bOff = waterRefractOffset(n, 1.0 / 1.348, thickness);
    col.r = mix(col.r, samplePlate(uv + rOff).r, graze * 0.12);
    col.b = mix(col.b, samplePlate(uv + bOff).b, graze * 0.12);
  }

  let plateUv = coverUv(uv + offset);
  let lightDir = lampLightDir(plateUv);
  let nDotL = max(dot(n, lightDir), 0.0);
  let painted = smoothstep(0.04, 0.16, luma(col));

  // Crests send the beam over the water (reflection). Troughs let it punch
  // through (transmission). Same Fresnel split as transmission/glass.wgsl.
  let crest = smoothstep(-0.04, 0.14, height);
  let trough = 1.0 - crest;
  let over = clamp(crest * mix(0.2, 1.0, fres), 0.0, 1.0);
  let through = (1.0 - over) * trough * mix(0.35, 1.0, nDotL);

  let viewDir = vec3f(0.0, 1.0, 0.0);
  let spec = blinnSpecular(n, viewDir, lightDir, mix(220.0, 520.0, params.quality));
  let chop = fbmSimplex2d(world * 0.4 + vec2f(params.time * 0.06, 0.0), 2, 2.1, 0.5);
  let foam = smoothstep(0.7, 0.28, wave.jacobian) * (0.3 + 0.7 * chop);

  let reflection = vec3f(0.01, 0.025, 0.05) + vec3f(0.92, 0.97, 1.0) * spec * painted * nDotL;
  col = mix(col, mix(col, reflection, 0.55), over * painted);
  col += vec3f(0.85, 0.93, 1.0) * spec * painted * over * 0.45;
  col += vec3f(0.55, 0.78, 1.0) * foam * painted * over * 0.22;

  // Through: a little extra path into the dark mass, only where the
  // painted beam already is and the facet faces the lamp.
  let body = smoothstep(0.14, 0.03, luma(col));
  col *= mix(1.0, 0.82, body * through * 0.55);
  col += vec3f(0.05, 0.12, 0.22) * body * through * painted * 0.18;
  col += vec3f(0.12, 0.28, 0.48) * through * painted * (1.0 - facing) * 0.08;

  let grain = fbmSimplex2d(uv * 24.0 + vec2f(params.time * 0.012, 0.0), 2, 2.0, 0.5);
  col += grain * 0.006;

  let vignette = 1.0 - 0.2 * dot(uv - vec2f(0.5), uv - vec2f(0.5));
  col *= vignette;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
