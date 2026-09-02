// Dielectric Schlick fresnel. Same shape as transmission/glass.wgsl
// (`dielectric_fresnel`) in the verified examples.
export fn dielectricFresnel(ior: f32, facing: f32) -> f32 {
  let f0 = pow((ior - 1.0) / (ior + 1.0), 2.0);
  return f0 + (1.0 - f0) * pow(1.0 - facing, 5.0);
}

// Same Blinn-Phong lobe as fft-ocean-surface/ocean-surface.wgsl.
export fn blinnSpecular(n: vec3f, viewDir: vec3f, lightDir: vec3f, hardness: f32) -> f32 {
  let h = normalize(lightDir + viewDir);
  return pow(max(dot(n, h), 0.0), hardness);
}

// Spectral RGB weights from transmission/glass.wgsl. White light through
// a dielectric (water or glass) splits along these lobes.
export fn spectralWeight(t: f32) -> vec3f {
  return vec3f(
    exp(-pow((t - 0.05) / 0.45, 2.0)),
    exp(-pow((t - 0.50) / 0.38, 2.0)),
    exp(-pow((t - 0.95) / 0.45, 2.0)),
  );
}

// Screen-space Snell offset. Same `refract()` used by the glass cube;
// looking down, the xz bend is the UV warp of whatever sits under the surface.
export fn waterRefractOffset(n: vec3f, eta: f32, thickness: f32) -> vec2f {
  let incident = vec3f(0.0, -1.0, 0.0);
  let bent = refract(incident, n, eta);
  if (dot(bent, bent) < 1.0e-6) {
    return vec2f(0.0);
  }
  return bent.xz * thickness;
}

export fn acesTonemap(x: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3f(0.0), vec3f(1.0));
}
