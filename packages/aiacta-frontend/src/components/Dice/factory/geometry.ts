import { BufferAttribute, BufferGeometry, Vector3 } from 'three';
import { dice, DieType } from './dieValues';

export type Face = { indices: number[][]; value: number };

export function createGeometry(die: DieType) {
  const { vertices, faces } = denormalize(dice[die].vertices, dice[die].faces);

  const geometry = new BufferGeometry();

  geometry.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array(
        faces.flatMap((f) =>
          f.indices.flatMap((is) => is.flatMap((i) => vertices[i].toArray())),
        ),
      ),
      3,
      false,
    ),
  );
  geometry.computeVertexNormals();

  let start = 0;
  faces.forEach(({ indices, value }) => {
    geometry.addGroup(start, indices.flat().length, value);
    start += indices.flat().length;
  });

  return geometry;
}

function denormalize(vertices: Vector3[], faces: Face[]) {
  const verticesC: Vector3[] = [];
  const facesC = faces.map((face) => ({
    indices: face.indices.map((i) =>
      i.map((idx) => verticesC.push(vertices[idx].clone()) - 1),
    ),
    value: face.value,
  }));

  return { vertices: verticesC, faces: facesC };
}
