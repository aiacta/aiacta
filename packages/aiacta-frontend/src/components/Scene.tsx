import { MapControls, Plane } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { TextureLoader } from 'three';
import { useSceneDetailsQuery } from '../api';
import { zIndices } from '../util';

export function Scene() {
  const { worldId, sceneId } = useParams();
  const [scene] = useSceneDetailsQuery({ variables: { worldId, sceneId } });

  if (!scene.data?.world?.scene) {
    return <>Not found</>;
  }

  console.log(scene.data?.world?.scene);

  return (
    <Canvas
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: zIndices.Canvas,
      }}
      orthographic
      camera={{ position: [0, 0, 50], zoom: 1000, up: [0, 0, 1], far: 10000 }}
    >
      <React.Suspense fallback={null}>
        <BackgroundImage buffer={scene.data?.world?.scene?.image?.data} />
      </React.Suspense>
      <MapControls />
    </Canvas>
  );
}

const textureLoader = new TextureLoader();

function BackgroundImage({ buffer }: { buffer?: number[] }) {
  const texture = React.useMemo(() => {
    if (!buffer) {
      return null;
    }

    return textureLoader.load(
      URL.createObjectURL(new Blob([Uint8Array.from(buffer)])),
    );
  }, [buffer]);

  return <Plane>{texture && <meshBasicMaterial map={texture} />}</Plane>;
}
