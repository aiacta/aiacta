import { Badge } from '@mantine/core';
import * as React from 'react';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useListScenesQuery } from '../api';
import { isTruthy, zIndices } from '../util';
import { Scene } from './Scene';
import { SceneDropzone } from './SceneDropzone';

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
