import { dielectricFresnel, acesTonemap } from "./lighting.wgsl";
import { skyColor } from "./sky.wgsl";
import { sampleWaves } from "./waves.wgsl";
import { fbmSimplex2d } from "@vgpu/wgsl-std/noise/simplex";

struct Params {
  time: f32,
  windSpeed: f32,
  texel: vec2f,
  lightPos: vec3f,
  quality: f32,
  lightDir: vec3f,
  windAngle: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

fn cameraRay(uv: vec2f) -> vec3f {
  let ndc = vec2f(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
  let aspect = params.texel.y / max(params.texel.x, 1.0e-6);
  let fwd = normalize(vec3f(0.12, -0.38, -1.0));
  let right = normalize(cross(fwd, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, fwd);
  return normalize(fwd + right * ndc.x * aspect * 0.72 + up * ndc.y * 0.55);
}

fn intersectWater(ro: vec3f, rd: vec3f) -> f32 {
  if (rd.y >= -1.0e-4) {
    return -1.0;
  }
  var t = (0.4 - ro.y) / rd.y;
  if (t < 0.0) {
    return -1.0;
  }
  let iters = select(1, 2, params.quality > 0.5);
  for (var i = 0; i < 2; i++) {
    if (i >= iters) { break; }
    let p = ro + rd * t;
    let wave = sampleWaves(p.xz, params.time, params.windAngle, params.windSpeed, params.quality);
    let err = p.y - wave.displacement.y;
    t += err / min(rd.y, -0.04);
  }
  return t;
}

fn coneMask(p: vec3f) -> f32 {
  let toPoint = p - params.lightPos;
  let dist = length(toPoint);
  let dir = toPoint / max(dist, 1.0e-3);
  let beam = normalize(params.lightDir);
  let along = max(dot(dir, beam), 0.0);
  let cone = smoothstep(0.78, 0.94, along);
  let reach = exp(-dist * 0.018);
  return cone * reach;
}

fn volumetricLight(ro: vec3f, rd: vec3f, tHit: f32) -> vec3f {
  let tFar = select(min(tHit, 70.0), 48.0, tHit < 0.0);
  let steps = select(8, 16, params.quality > 0.5);
  var fog = 0.0;
  for (var i = 0; i < 16; i++) {
    if (i >= steps) { break; }
    let t = (f32(i) + 0.5) / f32(steps) * tFar;
    let p = ro + rd * t;
    fog += coneMask(p) * exp(-t * 0.03);
  }
  fog *= tFar / f32(steps);
  return vec3f(1.35, 0.58, 0.16) * fog * 0.085;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let ro = vec3f(0.0, 11.5, 20.0);
  let rd = cameraRay(uv);
  let t = intersectWater(ro, rd);

  var col: vec3f;
  if (t < 0.0) {
    col = skyColor(rd, params.lightDir);
  } else {
    let world = ro + rd * t;
    let wave = sampleWaves(world.xz, params.time, params.windAngle, params.windSpeed, params.quality);
    let n = wave.normal;
    let v = normalize(ro - world);
    let sun = normalize(-params.lightDir);

    let chop = fbmSimplex2d(world.xz * 0.11 + vec2f(params.time * 0.15, 0.0), 3, 2.17, 0.5);
    let foam = smoothstep(0.55, 0.12, wave.jacobian) * (0.65 + 0.35 * chop);

    let r = reflect(-v, n);
    let refl = skyColor(r, params.lightDir);
    let facing = max(dot(n, v), 0.0);
    let fres = dielectricFresnel(1.333, facing);

    let deep = vec3f(0.004, 0.02, 0.04);
    let shallow = vec3f(0.04, 0.11, 0.14);
    var water = mix(deep, shallow, pow(facing, 0.55));
    let spot = coneMask(world);
    water += vec3f(0.95, 0.42, 0.1) * spot * 0.55;
    water += vec3f(0.85, 0.28, 0.08) * pow(max(dot(v, -sun), 0.0), 3.0) * 0.25;

    let fresW = mix(0.04, 0.9, fres);
    col = mix(water, refl, fresW);

    let h = normalize(sun + v);
    let spec = pow(max(dot(n, h), 0.0), 280.0);
    col += vec3f(1.8, 0.95, 0.4) * spec * (1.2 + 3.5 * spot);

    col = mix(col, vec3f(0.98, 0.86, 0.68), foam * (0.35 + 0.65 * spot));

    let fog = smoothstep(28.0, 78.0, t);
    col = mix(col, skyColor(normalize(vec3f(rd.x, 0.02, rd.z)), params.lightDir), fog);
  }

  col += volumetricLight(ro, rd, t);

  let grain = fbmSimplex2d(uv * 18.0 + vec2f(params.time * 0.04, 0.0), 2, 2.0, 0.5);
  col += grain * 0.012;

  col *= 0.72;
  col = pow(acesTonemap(col), vec3f(1.0 / 2.2));
  let vignette = 1.0 - 0.32 * dot(uv - vec2f(0.5), uv - vec2f(0.5));
  col *= vignette;

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
