// Analytic Gerstner waves. Used instead of the FFT displacement field from
// fft-ocean-surface so the fashion hero stays mobile-safe; normals and foam
// still follow that example's fragment lighting.

export struct WaveSample {
  displacement: vec3f,
  normal: vec3f,
  jacobian: f32,
}

const GRAVITY: f32 = 9.81;

fn gerstnerOne(
  p: vec2f,
  dir: vec2f,
  steepness: f32,
  wavelength: f32,
  time: f32,
  phase: f32,
) -> WaveSample {
  let d = normalize(dir);
  let k = 6.2831853 / wavelength;
  let c = sqrt(GRAVITY / k);
  let f = k * (dot(d, p) - c * time) + phase;
  let a = steepness / k;
  let sinF = sin(f);
  let cosF = cos(f);
  let wa = k * a;

  var s: WaveSample;
  s.displacement = vec3f(d.x * a * cosF, a * sinF, d.y * a * cosF);
  s.normal = vec3f(-d.x * wa * cosF, 1.0 - steepness * sinF, -d.y * wa * cosF);
  s.jacobian = 1.0 - steepness * cosF;
  return s;
}

export fn sampleWaves(p: vec2f, time: f32, windAngle: f32, windSpeed: f32, quality: f32) -> WaveSample {
  let wind = vec2f(cos(windAngle), sin(windAngle));
  let crossWind = vec2f(-wind.y, wind.x);
  let amp = clamp(windSpeed / 18.0, 0.25, 1.35);

  var acc: WaveSample;
  acc.displacement = vec3f(0.0);
  acc.normal = vec3f(0.0, 1.0, 0.0);
  acc.jacobian = 1.0;

    let w2 = normalize(wind + crossWind * 0.35);
    let w3 = normalize(wind - crossWind * 0.28);
    let w4 = normalize(wind + crossWind * 0.7);
    let w5 = normalize(wind - crossWind * 0.85);
    let waves = array<vec4f, 5>(
      vec4f(wind.x, wind.y, 0.32 * amp, 18.0),
      vec4f(w2.x, w2.y, 0.22 * amp, 9.5),
      vec4f(w3.x, w3.y, 0.16 * amp, 5.2),
      vec4f(w4.x, w4.y, 0.10 * amp, 2.8),
      vec4f(w5.x, w5.y, 0.07 * amp, 1.4),
    );
  let phases = array<f32, 5>(0.0, 1.7, 3.1, 4.6, 0.9);
  let count = select(3, 5, quality > 0.5);

  for (var i = 0; i < 5; i++) {
    if (i >= count) { break; }
    let w = waves[i];
    let s = gerstnerOne(p, w.xy, w.z, w.w, time, phases[i]);
    acc.displacement += s.displacement;
    acc.normal += vec3f(s.normal.x, s.normal.y - 1.0, s.normal.z);
    acc.jacobian *= s.jacobian;
  }

  acc.normal = normalize(acc.normal);
  if (acc.normal.y < 0.0) {
    acc.normal = -acc.normal;
  }
  return acc;
}
