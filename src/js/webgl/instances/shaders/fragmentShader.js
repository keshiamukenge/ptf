export const fragmentShader = `
precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform sampler2D tMap;
uniform vec2 uOffset;

varying vec2 vUv;

vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
  // With rgb distorsion
  // float r = texture2D(textureImage,uv + offset).r;
  // vec2 gb = texture2D(textureImage,uv).gb;
  // return vec3(r, gb);

  return texture2D(textureImage,uv).rgb;
}

void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  // vec4 texture = texture2D(tMap, uv);
  vec3 texture = rgbShift(tMap,vUv,uOffset);

  gl_FragColor = vec4(texture, 1.0);
}
`;

export default fragmentShader;
