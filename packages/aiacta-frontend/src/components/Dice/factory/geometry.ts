import { BufferAttribute, BufferGeometry, Vector3 } from 'three';
import { dice, DieType } from './dieValues';

export type Face = { indices: number[]; value: number };

export function createGeometry(die: DieType) {
  const { vertices, faces } = denormalize(dice[die].vertices, dice[die].faces);

  const faceGroups = faces.reduce((acc, { indices, value }) => {
    if (!acc.some((a) => a.value === value)) {
      acc.push({ value, indices: [] });
    }
    acc.find((a) => a.value === value)!.indices.push(indices);
    return acc;
  }, [] as { value: number; indices: number[][] }[]);

  const geometry = new BufferGeometry();

  geometry.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array(
        faceGroups.flatMap((f) =>
          f.indices.flatMap((is) => is.flatMap((i) => vertices[i].toArray())),
        ),
      ),
      3,
      false,
    ),
  );
  geometry.computeVertexNormals();

  let start = 0;
  faceGroups.forEach(({ indices, value }) => {
    geometry.addGroup(start, indices.flat().length, value);
    start += indices.flat().length;
  });

  return { geometry, vertices, faces, faceGroups };
}

function denormalize(vertices: Vector3[], faces: Face[]) {
  const verticesC: Vector3[] = [];
  const facesC = faces.map((face) => ({
    indices: face.indices.map((i) => verticesC.push(vertices[i].clone()) - 1),
    value: face.value,
  }));

  return { vertices: verticesC, faces: facesC };
}
