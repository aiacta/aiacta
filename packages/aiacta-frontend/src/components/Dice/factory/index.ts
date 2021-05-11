import { dice, DieType } from './dieValues';
import { createGeometry } from './geometry';
import { createShape } from './shape';
import { createTextureDataURL } from './texture';
import { createUvs } from './uv';

export function createDie(die: DieType) {
  const { geometry, vertices, faces } = createGeometry(die);
  const { uvTemplate, faceHeight, faceOffset } = dice[die];

  const uv = createUvs(vertices, faces, uvTemplate);

  const faceValues = Object.fromEntries(
    faces.map((face, i) => [i, face.value]),
  );

  geometry.setAttribute('uv', uv);

  const textureDataUrl = createTextureDataURL({
    uvAttribute: uv,
    faceValues,
    faceHeight,
    faceOffset,
    d4: Object.keys(faceValues).length === 4,
  });

  const shape = createShape(geometry, vertices, faces)!;

  return { geometry, textureDataUrl, shape };
}
