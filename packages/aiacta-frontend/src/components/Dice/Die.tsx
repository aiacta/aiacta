import { useLoader } from '@react-three/fiber';
import * as React from 'react';
import { TextureLoader } from 'three';
import { useDie } from '../Physics';
import { createDie } from './factory';

export function Die({
  type,
  ...props
}: {
  type: keyof typeof dice;
  targetValue?: number;
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  rotation?: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
}) {
  const [ref] = useDie({ ...props, shape: dice[type].shape, type });

  const textureMap = useLoader(TextureLoader, dice[type].textureDataUrl);

  return (
    <mesh
      ref={ref}
      name={type}
      castShadow
      receiveShadow
      geometry={dice[type].geometry}
    >
      <meshPhongMaterial map={textureMap} attach="material" />
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
