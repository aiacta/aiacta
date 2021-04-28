import {
  Camera,
  CannonJSPlugin,
  Color3,
  ICustomShaderNameResolveOptions,
  MaterialDefines,
  Scene as BabylonScene,
  Vector3,
} from '@babylonjs/core';
import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import { CustomMaterial } from '@babylonjs/materials';
import * as React from 'react';
import { useState } from 'react';
import { Engine, Scene, useEngine, useScene } from 'react-babylonjs';
import { useCssRule } from './hooks';

const gravityVector = new Vector3(0, -9.81, 0);

export function Canvas() {
  useCssRule('#canvas', {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
  });

  const [lightPosition] = useState(() => {
    const pos = new Vector3(0, 10, 0);

    let t = 0;
    setInterval(() => {
      t += 0.01;
      pos.x = (Math.cos(t) - 1) * 30;
      pos.z = (Math.cos(t) - 1) * 30;
    }, 1);

    return pos;
  });

  return (
    <Engine antialias adaptToDeviceRatio canvasId="canvas">
      <Scene enablePhysics={[gravityVector, new CannonJSPlugin()]}>
        <BirdseyeCamera />
        <hemisphericLight
          name="hemi"
          direction={new Vector3(0, 10, 0)}
          intensity={1}
        />
        <pointLight
          name="point"
          position={lightPosition}
          intensity={0}
          shadowMinZ={1}
          shadowMaxZ={2500}
        >
          <shadowGenerator
            mapSize={1024 * 1}
            shadowCasters={['plane1', 'plane2']}
            useContactHardeningShadow
            ref={(ref) => console.log(ref)}
          />
        </pointLight>
        <GroundPlane
          name="ground1"
          position={new Vector3(0, 0, 0)}
          rotation={new Vector3(Math.PI / 2, 0, 0)}
          size={100}
        />
        <GroundPlane
          name="ground2"
          position={new Vector3(0, 27, 92)}
          rotation={new Vector3(1, 0, 0)}
          size={100}
        />
        <plane
          name="plane1"
          size={40}
          position={new Vector3(0, 10, 20)}
          rotation={new Vector3(0, 0, 0)}
        />
        <plane
          name="plane2"
          size={20}
          position={new Vector3(10, 10, 10)}
          rotation={new Vector3(0, Math.PI / 2, 0)}
        />
      </Scene>
    </Engine>
  );
}

function BirdseyeCamera() {
  const engine = useEngine();

  const canvas = engine?.getRenderingCanvas();
  const aspect = canvas ? canvas.height / canvas.width : 1;
  const cameraWidth = 500;

  const orthoLeft = -cameraWidth / 2;
  const orthoRight = cameraWidth / 2;

  return (
    <freeCamera
      name="camera"
      position={new Vector3(0, 100, 0)}
      rotation={new Vector3(Math.PI / 2, Math.PI, 0)}
      mode={Camera.ORTHOGRAPHIC_CAMERA}
      orthoLeft={orthoLeft}
      orthoRight={orthoRight}
      orthoBottom={orthoLeft * aspect}
      orthoTop={orthoRight * aspect}
    />
  );
}

function GroundPlane({
  name,
  position,
  rotation,
  size,
}: {
  name: string;
  position: Vector3;
  rotation: Vector3;
  size: number;
}) {
  const scene = useScene();
  const material = useGroundMaterial(scene);

  scene?.debugLayer.show();

  return (
    <plane
      name={name}
      position={position}
      size={size}
      rotation={rotation}
      receiveShadows
    >
      <material name="groundMat" fromInstance={material} />
    </plane>
  );
}

let cachedMaterial: WeakRef<CustomMaterial> | null = null;
function useGroundMaterial(scene: BabylonScene | null) {
  const [groundMat] = useState(() => {
    if (!scene) {
      return undefined;
    }
    if (cachedMaterial?.deref()) {
      return cachedMaterial.deref();
    }
    const material = new CustomMaterial('groundMat', scene);
    material.diffuseColor = new Color3(1, 1, 1);
    material.ambientColor = new Color3(0, 0, 0);
    material.specularColor = new Color3(0, 0, 0);
    material.Fragment_Before_FragColor(`
   globalShadow = globalShadow / shadowLightCount;
   if (globalShadow < 1.) {
       color = vec4(0., 0., 0., 1.);
   }
  `);
    const originalNameResolve = material.customShaderNameResolve.bind(material);
    material.customShaderNameResolve = (
      shaderName: string,
      uniforms: string[],
      uniformBuffers: string[],
      samplers: string[],
      defines: MaterialDefines | string[],
      attributes?: string[] | undefined,
      options?: ICustomShaderNameResolveOptions | undefined,
    ) => {
      if (options) {
        options.processFinalCode = (type, code) => {
          if (type === 'vertex') {
            return code;
          }
          return code
            .replace(
              /float shadow=1\.;/,
              `float shadow=1.;
               float globalShadow = 0.;
               float shadowLightCount = 0.;`,
            )
            .replace(
              /diffuseBase\+=info\.diffuse\*shadow;/g,
              `globalShadow += shadow;
               shadowLightCount += 1.;
               diffuseBase+=info.diffuse*shadow;`,
            );
        };
      }
      return originalNameResolve(
        shaderName,
        uniforms,
        uniformBuffers,
        samplers,
        defines,
        attributes,
        options,
      );
    };
    cachedMaterial = new WeakRef(material);
    return material;
  });

  return groundMat;
}
