import { useFrame, useLoader } from '@react-three/fiber';
import * as React from 'react';
import { ShaderMaterial, TextureLoader, Vector3, Vector4 } from 'three';
import { useDie } from '../Physics';
import { createDie } from './factory';

export function Die({
  type,
  dissolve,
  onDissolved,
  ...props
}: {
  type: keyof typeof dice;
  dissolve?: boolean;
  onDissolved?: () => void;
  targetValue?: number;
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  rotation?: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
}) {
  const [ref] = useDie({ ...props, shape: dice[type].shape, type });

  const textureMap = useLoader(TextureLoader, dice[type].textureDataUrl);
  const noiseMap = useLoader(
    TextureLoader,
    'https://s3-us-west-1.amazonaws.com/shader-frog/crumpled_paper.jpg',
  );

  const uniforms = React.useMemo(
    () => ({
      // phong material uniforms
      Ka: { value: new Vector3(1, 1, 1) },
      Kd: { value: new Vector3(1, 1, 1) },
      Ks: { value: new Vector3(1, 1, 1) },
      LightIntensity: { value: new Vector4(0.5, 0.5, 0.5, 1.0) },
      LightPosition: { value: new Vector4(0.0, 200.0, 500.0, 1.0) },
      Shininess: { value: 200.0 },
      image: { value: textureMap },
      noise: { value: noiseMap },
      dissolve: { value: (Math.PI * 3) / 2 },
    }),
    [],
  );

  const materialRef = React.useRef<ShaderMaterial>();
  const calledDissolve = React.useRef(false);

  console.log(dissolve);

  useFrame(() => {
    if (materialRef.current && dissolve) {
      materialRef.current.uniforms.dissolve.value = Math.min(
        materialRef.current.uniforms.dissolve.value + 0.075,
        Math.PI * 3,
      );
      if (
        !calledDissolve.current &&
        materialRef.current.uniforms.dissolve.value >= Math.PI * 3
      ) {
        onDissolved?.();
        calledDissolve.current = true;
      }
    }
  });

  return (
    <mesh
      ref={ref}
      name={type}
      castShadow
      receiveShadow
      geometry={dice[type].geometry}
    >
      <shaderMaterial
        ref={materialRef}
        attach="material"
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

const dice = {
  d4: createDie('d4'),
  d6: createDie('d6'),
  d8: createDie('d8'),
  d10: createDie('d10'),
  d12: createDie('d12'),
  d20: createDie('d20'),
};

const fragmentShader = `
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

    vec3 phong() {
      vec3 n = normalize(Normal);
      vec3 s = normalize(vec3(LightPosition) - Position);
      vec3 v = normalize(vec3(-Position));
      vec3 r = reflect(-s, n);

      vec3 ambient = Ka;
      vec3 diffuse = Kd * max(dot(s, n), 0.0);
      vec3 specular = Ks * pow(max(dot(r, v), 0.0), Shininess);

      return LightIntensity * (ambient + diffuse + specular);
    }

    void main() {
      vec3 col = texture2D(image, vUv).xyz;
      vec3 noi = texture2D(noise, vUv).xyz;

      float alpha = 1.;
    
      if(noi.x > abs(sin(dissolve/3.)))
      {
          alpha = .0;
      }
      
      if(noi.x > abs(sin(dissolve/3.))-.07)
      {
          col = vec3(1.,0.,0.);
      }

      gl_FragColor = vec4(col*phong(), alpha);
  }`;

const vertexShader = `
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
      vec3 nor = vec3(.0,.0,.0);
      if(col.x > abs(sin(dissolve/3.))-.03)
      {
          nor = normal * 0.2 * sin(dissolve) * cos(dissolve) * tan(dissolve);
      }
      vec3 dsa = vec3(position + nor);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(dsa, 1.0);
    }
  `;
