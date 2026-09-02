// Analytic Gerstner spectrum. Same gravity / steepness model as the
// fft-ocean-surface Phillips sea, without the FFT displacement field so
// the fashion hero stays mobile-safe. Wavelengths sit on the aerial-chop
// scale of the MALUM still so live crests lock to the painted ones.

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
  let amp = clamp(windSpeed / 16.0, 0.55, 1.15);
  let peak = max(windSpeed * windSpeed / GRAVITY, 6.0);

  var acc: WaveSample;
  acc.displacement = vec3f(0.0);
  acc.normal = vec3f(0.0, 1.0, 0.0);
  acc.jacobian = 1.0;

  let d1 = normalize(wind + crossWind * 0.18);
  let d2 = normalize(wind - crossWind * 0.22);
  let d3 = normalize(wind + crossWind * 0.48);
  let d4 = normalize(wind - crossWind * 0.55);
  let d5 = normalize(wind + crossWind * 0.82);
  let d6 = normalize(wind - crossWind * 0.9);
  let d7 = normalize(wind + crossWind * 0.12);

  let waves = array<vec4f, 8>(
    vec4f(wind.x, wind.y, 0.32 * amp, peak * 1.15),
    vec4f(d1.x, d1.y, 0.26 * amp, peak * 0.72),
    vec4f(d2.x, d2.y, 0.2 * amp, peak * 0.46),
    vec4f(d3.x, d3.y, 0.15 * amp, peak * 0.3),
    vec4f(d4.x, d4.y, 0.11 * amp, peak * 0.19),
    vec4f(d5.x, d5.y, 0.08 * amp, peak * 0.12),
    vec4f(d6.x, d6.y, 0.06 * amp, peak * 0.075),
    vec4f(d7.x, d7.y, 0.045 * amp, peak * 0.048),
  );
  let phases = array<f32, 8>(0.0, 1.7, 3.1, 4.6, 0.9, 2.4, 5.2, 3.8);
  let count = select(5, 8, quality > 0.75);

  for (var i = 0; i < 8; i++) {
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
