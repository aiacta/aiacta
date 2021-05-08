import { BufferAttribute, Vector3 } from 'three';
import { Face } from './geometry';

export function createUvs(
  vertices: Vector3[],
  faces: Face[],
  uvTemplate: number[][],
) {
  const faceGroups = faces.reduce((acc, { indices, value }) => {
    if (value === -1) {
      return acc;
    }
    if (!acc[value]) {
      acc[value] = new Set();
    }
    indices.forEach((i) => acc[value].add(i));
    return acc;
  }, {} as { [value: number]: Set<number> });

  let offsetX = 0;
  let offsetY = 1;
  const faceCount = Object.keys(faceGroups).length;
  let perRow = faceCount;
  let perColumn = 1;
  while (faceCount / (perRow - 1) < perRow) {
    perColumn = Math.ceil(faceCount / --perRow);
  }
  const sizePerFace = Math.min(1 / perRow, 1 / perColumn);

  const uvs = Object.values(faceGroups).flatMap((indices, fi) => {
    const x = offsetX;
    const y = offsetY;
    offsetX += sizePerFace;
    if (offsetX + sizePerFace > 1) {
      offsetX = 0;
      offsetY -= sizePerFace;
    }
    return Array.from(indices, (_, i) => {
      return (
        uvTemplate[fi % uvTemplate.length]
          .slice(i * 2, i * 2 + 2)
          .map(
            (d, i) =>
              (i % 2 === 0 ? x : y) + d * sizePerFace * (i % 2 === 0 ? 1 : -1),
          ) ?? [
          x + ((i % 3) * sizePerFace) / 2,
          y - ((i % 3) * sizePerFace) / 2,
        ]
      );
    }).flat();
  });

  uvs.length = vertices.length * 2;

  return new BufferAttribute(new Float32Array(uvs), 2, false);
}