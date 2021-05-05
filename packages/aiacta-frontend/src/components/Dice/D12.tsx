import { useLoader } from '@react-three/fiber';
import * as React from 'react';
import { TextureLoader } from 'three';
import { useDie } from '../Physics';
import { createDie } from './factory';

export function D12({
  ...props
}: {
  targetValue?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  position?: [number, number, number];
  rotation?: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
}) {
  const [ref] = useDie({ ...props, shape, type: 'd12' });

  const textureMap = useLoader(TextureLoader, textureDataUrl);

  return (
    <mesh ref={ref} name="d12" castShadow receiveShadow geometry={geometry}>
      <meshPhongMaterial map={textureMap} attach="material" />
    </mesh>
  );
}

const { geometry, textureDataUrl, shape } = createDie('d12');
