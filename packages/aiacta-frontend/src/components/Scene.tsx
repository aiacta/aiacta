import {
  Application,
  Asset,
  BAKE_COLOR,
  BasicMaterial,
  Color,
  createMesh,
  Entity,
  FILLMODE_FILL_WINDOW,
  MeshInstance,
  RESOLUTION_AUTO,
  SHADOW_PCF3,
  StandardMaterial,
} from 'playcanvas';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useSceneDetailsQuery } from '../api';
import { extrudeWall, isTruthy, zIndices } from '../util';

const mergeWalls = false;

export function Scene() {
  const { worldId, sceneId } = useParams();

  if (!worldId || !sceneId) {
    throw new Error('Invalid entry');
  }

  const [scene] = useSceneDetailsQuery({ variables: { worldId, sceneId } });
  const appRef = React.useRef<Application>();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current && scene.data?.world?.scene) {
      if (!appRef.current) {
        const app = setupScene(canvasRef.current, scene.data?.world?.scene);
        appRef.current = app;
      }
    }
  }, [scene.data?.world?.scene]);

  if (!scene.data?.world?.scene) {
    return <>Not found</>;
  }

  return (
    <>
      <canvas
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: zIndices.Canvas,
        }}
        ref={canvasRef}
      />
    </>
  );
}

function setupScene(
  canvas: HTMLCanvasElement,
  scene: {
    image?: { data: number[] } | null;
    lights?:
      | ({ position: { x: number; y: number } } | null | undefined)[]
      | null;
    walls?:
      | ({ points: { x: number; y: number }[] } | null | undefined)[]
      | null;
  },
) {
  const app = new Application(canvas, {});

  // fill the available space at full resolution
  app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(RESOLUTION_AUTO);

  app.start();

  // ensure canvas is resized when window changes size
  window.addEventListener('resize', () => app.resizeCanvas());

  // create camera entity
  const camera = new Entity('camera');
  camera.addComponent('camera', {
    clearColor: new Color(0.1, 0.1, 0.1),
    farClip: 5000,
  });
  app.root.addChild(camera);
  camera.setPosition(0, 0, 3000);

  /// SETUP BACKGROUND
  if (scene.image?.data) {
    const asset = new Asset('texture', 'texture', {
      url: URL.createObjectURL(new Blob([Uint8Array.from(scene.image.data)])),
    });
    asset.ready((asset) => {
      const material = new StandardMaterial();
      material.diffuseMap = asset.resource;
      material.update();
      console.log('rdy');
      ground.render!.material = material;
    });
    app.assets.load(asset);

    const ground = new Entity('ground');
    ground.addComponent('render', {
      castShadows: false,
      castShadowsLightmap: false,
      receiveShadows: true,
      lightmapped: true,
      type: 'plane',
      isStatic: true,
    });
    app.root.addChild(ground);
    ground.setLocalEulerAngles(90, 0, 0);
    ground.setLocalPosition(0, 0, 0);
    ground.setLocalScale(2000, 2000, 2000);
  }

  /// SETUP WALLS
  const walls = [...(scene.walls ?? [])];

  const mergedWalls: typeof scene['walls'] = [];
  if (scene.walls) {
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

  mergedWalls.filter(isTruthy).forEach(({ points }) => {
    const { positions } = extrudeWall({
      points: points.map((p) => ({ x: p.x - 1000, y: -p.y + 1000 })),
      thickness: 10,
      height: 200,
    });

    const mesh = createMesh(app.graphicsDevice, positions, {
      // normals: calculateNormals(positions, indices),
      // indices,
    });

    console.log(mesh);

    const material = new BasicMaterial();
    material.color = Color.RED;
    material.update();
    const meshInstance = new MeshInstance(mesh, material);

    const wall = new Entity();
    wall.addComponent('render', {
      meshInstances: [meshInstance],
      castShadows: false,
      castShadowsLightmap: true,
      receiveShadows: true,
      lightmapped: true,
      isStatic: true,
    });
    wall.setLocalEulerAngles(0, 0, 0);
    wall.setLocalPosition(0, 0, 0);
    app.root.addChild(wall);

    wall.render!.meshInstances[0].material = material;
  });

  scene.lights?.filter(isTruthy).forEach((light) => {
    const le = new Entity();
    le.addComponent('light', {
      affectDynamic: false,
      affectLightmapped: true,
      bake: true,
      castShadows: true,
      normalOffsetBias: 0.05,
      shadowBias: 0.2,
      shadowDistance: 50,
      shadowResolution: 512,
      shadowType: SHADOW_PCF3,
      color: Color.WHITE,
      type: 'point',
      range: 250,
      isStatic: true,
    });
    le.setLocalPosition(light.position.x - 1000, -light.position.y + 1000, 50);
    console.log(le);
    app.root.addChild(le);
  });

  app.scene.lightmapSizeMultiplier = 32;
  app.scene.lightmapMode = BAKE_COLOR;
  app.scene.lightmapMaxResolution = 2048;
  app.lightmapper.bake(null, BAKE_COLOR);

  return app;
}
