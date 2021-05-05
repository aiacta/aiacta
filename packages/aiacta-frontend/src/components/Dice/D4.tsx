import { useLoader } from '@react-three/fiber';
import * as React from 'react';
import { TextureLoader } from 'three';
import { useDie } from '../Physics';
import { createDie } from './factory';

export function D4({
  ...props
}: {
  targetValue?: 1 | 2 | 3 | 4;
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  rotation?: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
}) {
  const [ref] = useDie({ ...props, shape, type: 'd4' });

  const textureMap = useLoader(TextureLoader, textureDataUrl);

  return (
    <mesh ref={ref} name="d4" castShadow receiveShadow geometry={geometry}>
      <meshPhongMaterial map={textureMap} attach="material" />
    </mesh>
  );
}

const { geometry, textureDataUrl, shape } = createDie('d4');
