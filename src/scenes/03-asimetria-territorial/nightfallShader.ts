/** u = 0 oeste, u = 1 este. Noche al este del terminador (`uv.x > uTerminatorX`). */
export const nightfallVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nightfallFragment = /* glsl */ `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform float uNightAmount;
uniform float uTerminatorX;
varying vec2 vUv;

bool isKey(vec4 color) {
  return color.a < 0.12 || (color.r > 0.55 && color.g < 0.45 && color.b > 0.35 && color.r - color.g > 0.2);
}

void main() {
  vec4 dayColor = texture2D(uDay, vUv);
  vec4 nightColor = texture2D(uNight, vUv);
  if (isKey(dayColor) || isKey(nightColor)) discard;
  float band = 0.045;
  float nightSide = smoothstep(uTerminatorX - band, uTerminatorX + band, vUv.x);
  float mixAmount = nightSide * uNightAmount;
  gl_FragColor = mix(dayColor, nightColor, mixAmount);
}
`;

export const cityVertex = /* glsl */ `
attribute float aWeight;
attribute float aIntensity;
varying float vIntensity;

void main() {
  vIntensity = aIntensity;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = (4.0 + aWeight * 14.0) * vIntensity;
  gl_Position = projectionMatrix * mv;
}
`;

export const cityFragment = /* glsl */ `
varying float vIntensity;

void main() {
  if (vIntensity <= 0.001) discard;
  vec2 point = gl_PointCoord - vec2(0.5);
  float alpha = smoothstep(0.5, 0.0, length(point)) * vIntensity;
  gl_FragColor = vec4(vec3(1.6, 1.35, 0.85) * vIntensity, alpha);
}
`;
