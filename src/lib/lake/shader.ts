/**
 * A single full-screen triangle covers the viewport with zero index buffer and
 * zero overdraw at the edges — the standard cheap alternative to a quad.
 */
export const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = (aPosition + 1.0) * 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

export const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform vec2  uResolution;
uniform float uTime;
uniform float uAuroraOpacity;
uniform float uDimFactor;
uniform float uRippleDimFactor;
uniform float uColHalf;
uniform float uColFeather;
uniform float uRippleFrequency;
uniform vec4  uRipples[12];
uniform int   uRippleCount;

uniform vec4  uFish[5];
uniform int   uFishCount;
uniform float uFishFlashTime;
uniform float uFishOpacity;

uniform vec3  uColorBg;
uniform vec3  uColorLink;
uniform vec3  uColorViolet;
uniform vec3  uColorGold;
uniform vec3  uColorAuroraGreen;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

/* Domain warping (Inigo Quilez) — feeding noise back into its own coordinate
 * lookup is what reads as liquid rather than clouds. Time coefficients stay
 * in the 0.01-0.02 range on purpose: that range is what makes it calm rather
 * than a lava lamp. */
float warpedField(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + t * 0.020),
    fbm(p + vec2(5.2, 1.3) + t * 0.015)
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.010),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.012)
  );
  return fbm(p + 4.0 * r);
}

vec3 auroraRamp(float v) {
  vec3 col = uColorBg;
  col = mix(col, uColorLink,   smoothstep(0.35, 0.55, v));
  col = mix(col, uColorViolet, smoothstep(0.55, 0.75, v));
  col = mix(col, uColorGold,   smoothstep(0.82, 0.95, v));
  return col;
}

/* Written out explicitly (not via a mat2 constructor) so the rotation is
 * correct by inspection — GLSL's column-major mat2(a,b,c,d) convention is an
 * easy place to introduce a silent "rotates the wrong way" bug. */
vec2 rotate(vec2 v, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

/* A small fish silhouette: an elongated body plus a wagging tail, both as
 * soft elliptical blobs (not a true SDF — the elliptical scaling distorts
 * distance, but that is fine here, we only need "negative-ish inside,
 * growing outside" for a smoothstep edge, not exact distance). Returns a
 * dimensionless value: <=0 inside the body/tail, growing positive outward. */
float fishShape(vec2 p, float heading, float wag) {
  vec2 lp = rotate(p, -heading);

  float bodyLen = 0.026;
  float bodyWid = 0.010;
  float body = length(lp / vec2(bodyLen, bodyWid)) - 1.0;

  vec2 tailAnchor = vec2(-bodyLen * 0.85, 0.0);
  vec2 tailLocal = rotate(lp - tailAnchor, -wag);
  float tail = length(tailLocal / vec2(bodyLen * 0.4, bodyWid * 0.6)) - 1.0;

  return min(body, tail);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;

  /* Stretched vertically so the field ribbons like aurora instead of pooling
   * into blobs. This is warp-space — independent of the plain-uv column mask below. */
  vec2 p = vec2((uv.x - 0.5) * aspect, (uv.y - 0.5) * 2.5) * 2.2;

  vec2 warpOffset = vec2(0.0);
  float rippleEnergy = 0.0;

  for (int i = 0; i < 12; i++) {
    if (i >= uRippleCount) break;
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (age < 0.0 || age > 2.4) continue;

    vec2 rp = vec2((r.x - 0.5) * aspect, (r.y - 0.5) * 2.5) * 2.2;
    vec2 delta = p - rp;
    float d = length(delta) + 1e-4;

    float maxR = 1.6;
    /* Fast then easing — real droplet physics, not a linear spread. */
    float radius = maxR * (1.0 - exp(-3.0 * age));
    float ring = sin((d - radius) * uRippleFrequency)
               * exp(-2.2 * age)
               * exp(-14.0 * abs(d - radius))
               * r.w;

    /* (a) Refraction — bend the noise lookup along the ring normal. This is
     *     what makes it read as water, not a circle drawn on top. Divide by
     *     the epsilon-padded d, not a fresh normalize() call — right at the
     *     ripple's epicentre (delta == (0,0)) normalize() computes its own
     *     unpadded length() and produces NaN from 0/0, which corrupts the
     *     noise field exactly where the ripple is meant to be visible. */
    warpOffset += (delta / d) * ring * 0.12;
    /* (b) Bloom energy — pushed into the colour ramp below, so the ring
     *     brightens using the same palette rather than a separate colour. */
    rippleEnergy += max(ring, 0.0);
  }

  float v = warpedField(p + warpOffset, uTime);
  vec3 color = auroraRamp(v);
  color = mix(color, uColorGold, clamp(rippleEnergy * 0.6, 0.0, 0.5));

  /* Auto-dim mask, in plain uv fraction of viewport width (no aspect term —
   * this is a horizontal band test, not a radial one). Full aurora in the
   * margins; quiet behind the --max-width-reading column. Ripples get less
   * dimming than the ambient field, so a tap on a paragraph still lands. */
  float distFromCentre = abs(uv.x - 0.5);
  float colMask = smoothstep(uColHalf - uColFeather, uColHalf + uColFeather, distFromCentre);
  float ambientMix = mix(uDimFactor, 1.0, colMask);
  float rippleMix  = mix(uRippleDimFactor, 1.0, colMask);
  float energyMask = mix(ambientMix, rippleMix, clamp(rippleEnergy * 2.0, 0.0, 1.0));

  vec3 finalColor = mix(uColorBg, color, uAuroraOpacity * energyMask);

  /* Fish: small silhouettes drifting through the water. Resting colour is a
   * dim shadow of the water itself; any click flashes ALL of them bright
   * aurora green together, decaying over a couple of seconds. Composited
   * last, on top of the water, and dimmed by the same reading-column mask
   * so they never compete with text — same guarantee the water itself gets. */
  float fishFlash = exp(-3.0 * max(uTime - uFishFlashTime, 0.0));
  vec3 fishRestColor = mix(uColorBg, uColorLink, 0.4);
  vec3 fishColor = fishRestColor;
  float fishMask = 0.0;

  for (int i = 0; i < 5; i++) {
    if (i >= uFishCount) break;
    vec4 f = uFish[i];
    vec2 worldP = vec2((uv.x - f.x) * aspect, uv.y - f.y);
    float dist = fishShape(worldP, f.z, f.w);
    float m = 1.0 - smoothstep(0.0, 0.18, dist);
    if (m > fishMask) {
      fishMask = m;
      fishColor = mix(fishRestColor, uColorAuroraGreen, fishFlash);
    }
  }

  float fishVisibility = mix(uDimFactor * 0.6, 1.0, colMask);
  float flashBoost = mix(1.0, 1.6, fishFlash);
  finalColor = mix(finalColor, fishColor, clamp(fishMask * fishVisibility * uFishOpacity * flashBoost, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, 1.0);
}
`
