// Shared night-sky + searchlight disk. Derived from the verified
// fft-ocean-surface/sky.wgsl example, retuned for MALUM (storm at night,
// amber beam instead of a sunset sun).
export fn skyColor(dir: vec3f, lightDir: vec3f) -> vec3f {
  let d = normalize(dir);
  let beam = normalize(-lightDir);

  let up = clamp(d.y, 0.0, 1.0);
  let horizon = vec3f(0.12, 0.06, 0.04);
  let zenith = vec3f(0.012, 0.018, 0.04);
  var col = mix(horizon, zenith, pow(up, 0.55));

  let band = exp(-abs(d.y) * 8.0);
  col += vec3f(0.22, 0.08, 0.02) * band;
  let below = clamp(-d.y, 0.0, 1.0);
  col = mix(col, vec3f(0.01, 0.03, 0.05), below);

  let m = max(dot(d, beam), 0.0);
  col += vec3f(1.15, 0.48, 0.12) * pow(m, 14.0) * 0.45;
  col += vec3f(1.6, 0.72, 0.22) * pow(m, 80.0) * 0.9;
  let disk = smoothstep(0.9975, 0.9994, m);
  col += vec3f(1.7, 0.85, 0.28) * disk * 3.2;

  return col;
}
