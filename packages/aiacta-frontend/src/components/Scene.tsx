import { Badge, MantineTheme, theming } from '@mantine/core';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useListScenesQuery, useSceneDetailsQuery } from '../api';
import { isTruthy, zIndices } from '../util';
import { SceneDropzone } from './SceneDropzone';

const useStyles = createUseStyles(
  (theme: MantineTheme) => ({
    container: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
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

export function Scenes() {
  const { worldId } = useParams();
  const [scenes] = useListScenesQuery({ variables: { worldId } });

  return (
    <>
      <Routes>
        <Route path="scene/:sceneId" element={<Scene />} />
        <Route element={<SceneDropzone />} />
      </Routes>
      <div style={{ position: 'absolute', zIndex: zIndices.Hotbar }}>
        {scenes.data?.world?.scenes?.filter(isTruthy).map((scene) => (
          <SceneBadge key={scene.id} id={scene.id} name={scene.name} />
        ))}
      </div>
    </>
  );
}

function SceneBadge({ id, name }: { id: string; name: string }) {
  const to = `scene/${id}`;

  const location = useLocation();
  const path = useResolvedPath(to);

  const isActive = location.pathname.startsWith(path.pathname);

  return (
    <Badge
      key={id}
      variant={isActive ? 'filled' : 'outline'}
      component={Link}
      to={to}
      style={{ cursor: 'pointer' }}
    >
      {name}
    </Badge>
  );
}

function Scene() {
  const classes = useStyles();

  const { worldId, sceneId } = useParams();
  const [scene] = useSceneDetailsQuery({ variables: { worldId, sceneId } });

  console.log(scene);

  return <div className={classes.container}></div>;
}
