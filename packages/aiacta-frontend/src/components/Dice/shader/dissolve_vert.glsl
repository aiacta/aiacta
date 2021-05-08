varying vec3 Normal;
varying vec3 Position;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform float dissolve;
uniform sampler2D noise;

void main() {

  vNormal = normal;
  vUv = uv;
  vPosition = position;

  Normal = normalize(normalMatrix * normal);
  Position = vec3(modelViewMatrix * vec4(position, 1.0));

  vec3 col = texture2D(noise, uv).xyz;
  vec3 nor = vec3(.0, .0, .0);
  if(col.x > abs(sin(dissolve / 3.)) - .03) {
    nor = normal * 0.2 * sin(dissolve) * cos(dissolve) * tan(dissolve);
  }
  vec3 dsa = vec3(position + nor);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(dsa, 1.0);
}
