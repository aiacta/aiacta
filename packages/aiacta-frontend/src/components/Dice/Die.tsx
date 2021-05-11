import { useFrame, useLoader } from '@react-three/fiber';
import * as React from 'react';
import {
  AudioLoader,
  PositionalAudio,
  ShaderMaterial,
  TextureLoader,
  Vector3,
  Vector4,
} from 'three';
import paper from './crumpled_paper.jpeg';
import { DiceBoxContext } from './DiceBox';
import dieSound from './die.wav?url';
import { createDie } from './factory';
import { useDie } from './Physics';
import fragmentShader from './shader/dissolve_frag.glsl?raw';
import vertexShader from './shader/dissolve_vert.glsl?raw';

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
  const { audioListener } = React.useContext(DiceBoxContext);
  const audioRef = React.useRef<PositionalAudio>();
  const sound = useLoader(AudioLoader, dieSound);
  React.useEffect(() => {
    audioRef.current?.setRefDistance(40);
  }, []);

  const [ref, fromValue, toValue] = useDie({
    ...props,
    shape: dice[type].shape,
    type,
    onCollision: (info) => {
      if (!audioRef.current?.isPlaying && info.contact.restitution === 0.3) {
        audioRef.current?.setVolume(
          Math.min(1, info.target.velocity.length() / 50),
        );
        audioRef.current?.play();
      }
    },
  });

  const textureMaps = useLoader(
    TextureLoader,
    (dice[type] as any).textureDataUrls as string[],
  );
  const noiseMap = useLoader(TextureLoader, paper);

  const uniforms = React.useMemo(
    () => ({
      // phong material uniforms
      Ka: { value: new Vector3(1, 1, 1) },
      Kd: { value: new Vector3(1, 1, 1) },
      Ks: { value: new Vector3(1, 1, 1) },
      LightIntensity: { value: new Vector4(0.5, 0.5, 0.5, 1.0) },
      LightPosition: { value: new Vector4(0.0, 200.0, 500.0, 1.0) },
      Shininess: { value: 200.0 },
      image: { value: textureMaps[0] },
      noise: { value: noiseMap },
      dissolve: { value: (Math.PI * 3) / 2 },
      uvOffset: { value: 0 },
    }),
    [],
  );

  const materialRef = React.useRef<ShaderMaterial>();
  const calledDissolve = React.useRef(false);

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

  const geometry = React.useMemo(() => {
    const geom = dice[type].geometry.clone();
    const maxValue = +type.slice(1);
    if (toValue) {
      geom.groups.forEach((group, idx) => {
        if (
          typeof group.materialIndex === 'number' &&
          group.materialIndex > 0
        ) {
          group.materialIndex =
            ((idx + (toValue - fromValue) + maxValue) % maxValue) + 1;
        }
      });
    }
    return geom;
  }, [fromValue, toValue]);

  return (
    <mesh ref={ref} name={type} geometry={geometry} castShadow receiveShadow>
      {false && (
        <shaderMaterial
          ref={materialRef}
          attachArray="material"
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      )}
      <meshPhongMaterial color="rgb( 255, 63, 63 )" attachArray="material" />
      {textureMaps.map((map) => (
        <meshPhongMaterial key={map.uuid} map={map} attachArray="material" />
      ))}
      <positionalAudio
        ref={audioRef}
        buffer={sound}
        args={[audioListener]}
        autoplay={false}
        loop={false}
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
