import { DieType } from './dieValues';
import { createGeometry } from './geometry';
import { createShape } from './shape';
import { createTextures } from './texture';

export function createDie(die: DieType) {
  const { geometry, vertices, faces, faceGroups } = createGeometry(die);

  const shape = createShape(geometry, vertices, faces)!;

  const { uv, textureDataUrls } = createTextures(die, vertices, faceGroups);

  geometry.setAttribute('uv', uv);

  return {
    geometry,
    textureDataUrls,
    shape,
  };
}
