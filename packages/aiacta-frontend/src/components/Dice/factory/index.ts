import { DieType } from './dieValues';
import { createGeometry } from './geometry';
import { createTextures } from './texture';

export function createDie(die: DieType) {
  const geometry = createGeometry(die);

  const { uv, textureDataUrls } = createTextures(
    die,
    geometry.attributes.position.count,
  );

  geometry.setAttribute('uv', uv);

  return {
    geometry,
    textureDataUrls,
  };
}
