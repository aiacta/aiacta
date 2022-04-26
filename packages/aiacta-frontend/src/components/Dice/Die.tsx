import { useFrame, useLoader } from '@react-three/fiber';
import * as React from 'react';
import {
  AudioListener,
  AudioLoader,
  Mesh,
  PositionalAudio,
  TextureLoader,
} from 'three';
import paper from './assets/crumpled_paper.jpeg';
import dieSound from './assets/die.wav?url';
import { createDie } from './factory';
import { usePhysicsForDie } from './physics';
import fragmentShader from './shader/dissolve_frag.glsl?raw';
import fragmentNoImageShader from './shader/dissolve_fragNoImage.glsl?raw';
import vertexShader from './shader/dissolve_vert.glsl?raw';
import vertexNoImageShader from './shader/dissolve_vertNoImage.glsl?raw';

export function Die({
  id,
  type,
  onDissolved,
  onWakeUp,
  onRest,
  targetValue,
  rolledValue,
  iteration,
}: {
  id: string;
  type: keyof typeof dice;
  onDissolved: () => void;
  onWakeUp: () => void;
  onRest: () => void;
  targetValue: number;
  rolledValue: number;
  iteration: number;
}) {
  const ref = React.useRef<Mesh>(null!);

  const audioRef = React.useRef<PositionalAudio>(null!);
  const sound = useLoader(AudioLoader, dieSound);
  React.useEffect(() => {
    audioRef.current?.setRefDistance(40);
  }, []);

  const textureMaps = useLoader(
    TextureLoader,
    (dice[type] as any).textureDataUrls as string[],
  );
  const noiseMap = useLoader(TextureLoader, paper);

  const uniforms = React.useMemo(
    () => ({
      noise: { value: noiseMap },
      dissolve: { value: 0 },
    }),
    [],
  );
  const calledDissolve = React.useRef(false);
  const frames = React.useRef(0);

  useFrame(() => {
    if (ref.current) {
      if (++frames.current >= iteration + 30) {
        uniforms.dissolve.value = Math.min(uniforms.dissolve.value + 0.01, 1);
        if (!calledDissolve.current && uniforms.dissolve.value >= 1) {
          onDissolved?.();
          calledDissolve.current = true;
        }
      }
    }
  });

  const geometry = React.useMemo(() => {
    const geom = dice[type].geometry.clone();
    if (targetValue) {
      const maxValue = +type.slice(1);
      const distance = targetValue - rolledValue;
      geom.groups.forEach((group) => {
        if (
          typeof group.materialIndex === 'number' &&
          group.materialIndex > 0
        ) {
          group.materialIndex =
            ((group.materialIndex - 1 + distance + maxValue) % maxValue) + 1;
        }
      });
    }
    return geom;
  }, [rolledValue, targetValue]);

  React.useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  usePhysicsForDie(id, {
    mesh: ref,
    onCollision: (info) => {
      if (!audioRef.current?.isPlaying) {
        audioRef.current?.setVolume(
          Math.min(1, info.target.velocity.length() / 50),
        );
        audioRef.current?.play();
      }
    },
    onWakeUp,
    onRest,
  });

  return (
    <mesh
      ref={ref}
      name={type}
      geometry={geometry}
      castShadow
      receiveShadow
      position={[1000, 0, 0]}
    >
      <shaderMaterial
        attach="material-0"
        fragmentShader={fragmentNoImageShader}
        vertexShader={vertexNoImageShader}
        uniforms={uniforms}
      />
      {textureMaps.map((texture, idx) => (
        <shaderMaterial
          key={texture.uuid}
          attach={`material-${idx + 1}`}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={{
            image: { value: texture },
            ...uniforms,
          }}
        />
      ))}
      <positionalAudio
        ref={audioRef}
        buffer={sound}
        args={[new AudioListener()]}
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
