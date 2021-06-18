import { MapControls, Plane } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { TextureLoader } from 'three';
import { useSceneDetailsQuery } from '../api';
import { extrudeWall, zIndices } from '../util';

const mergeWalls = false;

export function Scene() {
  const { worldId, sceneId } = useParams();
  const [scene] = useSceneDetailsQuery({ variables: { worldId, sceneId } });

  if (!scene.data?.world?.scene) {
    return <>Not found</>;
  }

  console.log(scene.data?.world?.scene);

  const walls = [...(scene.data?.world?.scene.walls ?? [])];

  const mergedWalls: typeof walls = [];
  if (walls) {
    while (walls.length > 0) {
      const [wall] = walls.splice(0, 1);
      if (wall) {
        let hasMerged = true;
        while (hasMerged) {
          const overlap = walls.find((w) =>
            w?.points.some((p1) =>
              wall.points.some((p2) => p1.x === p2.x && p1.y === p2.y),
            ),
          );
          if (overlap && mergeWalls) {
            walls.splice(walls.indexOf(overlap), 1);
            wall.points.push(...overlap.points);
            wall.points = wall.points.filter(
              (p1, i, a) =>
                i === a.findIndex((p2) => p1.x === p2.x && p1.y === p2.y),
            );
          } else {
            hasMerged = false;
          }
        }
        mergedWalls.push(wall);
      }
    }
  }

  console.log(mergedWalls);

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
      // orthographic
      camera={{ position: [0, 0, 50], zoom: 1, up: [0, 0, 1], far: 10000 }}
    >
      <React.Suspense fallback={null}>
        <BackgroundImage buffer={scene.data?.world?.scene?.image?.data} />
        {mergedWalls?.map(
          (wall, idx) =>
            wall?.points && <Wall key={idx} points={wall?.points} />,
        )}
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

  return (
    <Plane scale={[2000, 2000, 1]}>
      {texture && <meshBasicMaterial map={texture} />}
    </Plane>
  );
}

let idx = 0;

function Wall({ points }: { points: { x: number; y: number }[] }) {
  const color = React.useMemo(
    () =>
      ['red', 'green', 'yellow', 'blue', 'purple', 'white', 'hotpink', 'brown'][
        ++idx % 8
      ],
    [],
  );

  const geometry = React.useMemo(
    () =>
      extrudeWall({
        points: points.map((p) => ({ x: p.x - 1000, y: -p.y + 1000 })),
        thickness: 10,
        height: 100,
      }),
    [points],
  );

  return (
    <>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  );
}
