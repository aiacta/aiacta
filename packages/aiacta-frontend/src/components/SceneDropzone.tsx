import { MantineTheme, theming } from '@mantine/core';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import { useCreateSceneMutation } from '../api';
import { useDropzone } from '../hooks';
import { zIndices } from '../util';

type Radian = number;
type UniversalVTTPosition = { x: number; y: number };
type UniversalVTTSceneDefinition = {
  format: 0.2;
  environment: { ambient_light: string };
  image: string;
  lights: {
    position: UniversalVTTPosition;
    color: string;
    intensity: number;
    range: number;
    shadows: boolean;
  }[];
  line_of_sight: UniversalVTTPosition[][];
  portals: {
    position: UniversalVTTPosition;
    bounds: UniversalVTTPosition[];
    closed: boolean;
    freestanding: boolean;
    rotation: Radian;
  }[];
  resolution: {
    map_origin: { x: number; y: number };
    map_size: { x: number; y: number };
    pixels_per_grid: number;
  };
};

const useStyles = createUseStyles(
  (theme: MantineTheme) => ({
    container: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      zIndex: zIndices.Dropzone,
    },
    active: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 'calc(100vw - 16px)',
      height: 'calc(100vh - 16px)',
      border: `4px dashed ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.dark[1]
      }`,
      borderRadius: theme.radius.md,
      boxSizing: 'border-box',
      pointerEvents: 'none',
      margin: '8px',
    },
  }),
  { theming },
);

export function SceneDropzone() {
  const { worldId } = useParams();
  const [, createScene] = useCreateSceneMutation();

  const { isActive, getRootProps } = useDropzone({
    onDrop: async (files) => {
      // TODO for now only handle first file
      const file = files[0];
      const text = await file.text();
      if (file.name.endsWith('dd2vtt')) {
        // Handle Universal VTT file
        const vttScene = JSON.parse(text) as UniversalVTTSceneDefinition;

        const transformPoint = (p: { x: number; y: number }) => ({
          x: Math.round(p.x * vttScene.resolution.pixels_per_grid),
          y: Math.round(p.y * vttScene.resolution.pixels_per_grid),
        });

        await createScene({
          worldId,
          name: file.name.replace(/\.dd2vtt$/, '') || 'New Scene',
          width:
            vttScene.resolution.map_size.x *
            vttScene.resolution.pixels_per_grid,
          height:
            vttScene.resolution.map_size.y *
            vttScene.resolution.pixels_per_grid,
          grid: {
            size: vttScene.resolution.pixels_per_grid,
            offset: vttScene.resolution.map_origin,
          },
          image: new Blob([vttScene.image]),
          walls: vttScene.line_of_sight.map((los) => ({
            points: los.map(transformPoint),
          })),
          lights: vttScene.lights.map((light) => ({
            position: transformPoint(light.position),
          })),
        });
      }
    },
  });

  const classes = useStyles();

  return (
    <div {...getRootProps()} className={classes.container}>
      {isActive && <div className={classes.active} />}
    </div>
  );
}
