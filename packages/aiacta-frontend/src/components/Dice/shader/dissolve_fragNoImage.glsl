varying vec3 Normal;
varying vec3 Position;
varying vec2 vUv;

vec3 Ka = vec3(1., 1., 1.);
vec3 Kd = vec3(1., 1., 1.);
vec3 Ks = vec3(1., 1., 1.);
vec4 LightPosition = vec4(0., 200., 500., 1.);
vec3 LightIntensity = vec3(0.5, 0.5, 0.5);
float Shininess = 200.;

uniform sampler2D noise;
uniform float dissolve;

vec3 phong() {
  vec3 n = normalize(Normal);
  vec3 s = normalize(vec3(LightPosition) - Position);
  vec3 v = normalize(vec3(-Position));
  vec3 r = reflect(-s, n);

  vec3 ambient = Ka;
  vec3 diffuse = Kd * max(dot(s, n), 0.);
  vec3 specular = Ks * pow(max(dot(r, v), 0.), Shininess);

  return LightIntensity * (ambient + diffuse + specular);
}

void main() {
  vec3 col = vec3(1., 0., 0.);

  vec3 noi = texture2D(noise, vUv).xyz;

  float alpha = 1.;

  if(noi.x < dissolve - 0.07) {
    col = noi.xyz * vec3(1.5, 1.0, 0.);
    alpha = 1. - (noi.x + dissolve - 0.1);
  }

  gl_FragColor = vec4(col * phong(), alpha);
}
