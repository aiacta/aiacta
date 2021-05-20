varying vec3 Normal;
varying vec3 Position;
varying vec2 vUv;

uniform sampler2D noise;
uniform float dissolve;

void main() {
  Normal = normalize(normalMatrix * normal);
  Position = vec3(modelViewMatrix * vec4(position, 1.0));
  vUv = vec2(mod(position.x, 1.), mod(position.x, 1.));

  vec3 col = texture2D(noise, vUv).xyz;
  vec3 nor = vec3(.0, .0, .0);
  if(col.x < dissolve - .03) {
    nor = normal * 0.2 * sin(dissolve) * cos(dissolve) * tan(dissolve);
  }
  vec3 dsa = vec3(position + nor);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(dsa, 1.0);
}
