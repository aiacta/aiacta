varying vec3 Normal;
varying vec3 Position;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 Ka;
uniform vec3 Kd;
uniform vec3 Ks;
uniform vec4 LightPosition;
uniform vec3 LightIntensity;
uniform float Shininess;

uniform sampler2D image;
uniform float dissolve;
uniform sampler2D noise;
uniform float uvOffset;

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
  vec3 col = texture2D(image, vec2(mod(vUv.x + uvOffset, 1.), vUv.y)).xyz;
  vec3 noi = texture2D(noise, vUv).xyz;

  float alpha = 1.;

  if(noi.x > abs(sin(dissolve / 3.))) {
    alpha = .0;
  }

  if(noi.x > abs(sin(dissolve / 3.)) - .07) {
    col = vec3(1., 0., 0.);
  }

  gl_FragColor = vec4(col * phong(), alpha);
}
