import { BufferAttribute, BufferGeometry, Vector3 } from 'three';
import { dice, DieType } from './dieValues';

export type Face = { indices: number[]; value: number };

const useChamfer = false;

export function createGeometry(die: DieType) {
  const { vertices, faces } = useChamfer
    ? createChamfer(dice[die].vertices, dice[die].faces, dice[die].chamfer)
    : denormalize(dice[die].vertices, dice[die].faces);

  const geometry = new BufferGeometry();

  geometry.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array(vertices.flatMap((v) => v.toArray())),
      3,
      false,
    ),
  );
  geometry.index = new BufferAttribute(
    new Uint16Array(faces.flatMap((face) => face.indices)),
    1,
    false,
  );
  geometry.computeVertexNormals();

  return { geometry, vertices, faces };
}

function denormalize(vertices: Vector3[], faces: Face[]) {
  const verticesC: Vector3[] = [];
  const facesC = faces.map((face) => ({
    indices: face.indices.map((i) => verticesC.push(vertices[i].clone()) - 1),
    value: face.value,
  }));

  return { vertices: verticesC, faces: facesC };
}

function createChamfer(vertices: Vector3[], faces: Face[], chamfer: number) {
  const chamferVertices: Vector3[] = [];
  const chamferFaces: Face[] = [];
  const cornerFaces = new Array(vertices.length)
    .fill(null)
    .map(() => [] as number[]);

  for (const face of faces) {
    const center = new Vector3();
    const newFace: Face = { indices: [], value: face.value };
    for (const [i, index] of face.indices.entries()) {
      const v = vertices[index].clone();
      center.add(v);
      cornerFaces[index].push(
        (newFace.indices[i] = chamferVertices.push(v) - 1),
      );
    }
    console.log(newFace);
    center.divideScalar(face.indices.length);
    for (const i of face.indices.keys()) {
      const v = chamferVertices[newFace.indices[i]];
      v.sub(center).multiplyScalar(chamfer).add(center);
    }
    chamferFaces.push(newFace);
  }

  for (let face1 = 0; face1 < faces.length - 1; ++face1) {
    for (let face2 = 0; face2 < faces.length; ++face2) {
      const pairs = [];
      let lastM = -1;
      for (let m = 0; m < faces[face1].indices.length; ++m) {
        const n = faces[face2].indices.indexOf(faces[face1].indices[m]);
        if (n >= 0) {
          if (lastM >= 0 && m !== lastM + 1) {
            pairs.unshift([face1, m], [face2, n]);
          } else {
            pairs.push([face1, m], [face2, n]);
          }
          lastM = m;
        }
      }
      if (pairs.length !== 4) continue;
      chamferFaces.push({
        indices: [
          chamferFaces[pairs[0][0]].indices[pairs[0][1]],
          chamferFaces[pairs[1][0]].indices[pairs[1][1]],
          chamferFaces[pairs[3][0]].indices[pairs[3][1]],
        ],
        value: -1,
      });
      chamferFaces.push({
        indices: [
          chamferFaces[pairs[0][0]].indices[pairs[0][1]],
          chamferFaces[pairs[3][0]].indices[pairs[3][1]],
          chamferFaces[pairs[2][0]].indices[pairs[2][1]],
        ],
        value: -1,
      });
    }
  }

  console.log(cornerFaces, [...chamferFaces]);

  // for (const cornerFace of cornerFaces) {
  //   if (cornerFace.length === 3) {
  //     chamferFaces.push({ indices: cornerFace, value: -1 });
  //   } else {
  //     const face = cornerFace.slice(0, 3);
  //     const next = cornerFace.slice(3);
  //     while (next.length > 1) {
  //       chamferFaces.push({ indices: face, value: -1 });
  //       face.splice(1, 1);
  //       face.push(next.shift()!);
  //     }
  //   }
  // }

  // for (const cornerFace of cornerFaces) {
  //   const face = [cornerFace[0]];
  //   for (let count = face.length - 1; count > 0; --count) {
  //     for (let m = faces.length; m < chamferFaces.length; ++m) {
  //       let index = chamferFaces[m].indices.indexOf(face[face.length - 1]);
  //       if (index >= 0) {
  //         if (--index === -1) {
  //           index = 2;
  //         }
  //         const nextVertex = chamferFaces[m].indices[index];
  //         if (cornerFace.indexOf(nextVertex) >= 0) {
  //           face.push(nextVertex);
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   chamferFaces.push({ indices: face, value: -1 });
  // }

  console.log(chamferFaces);

  return { vertices: chamferVertices, faces: chamferFaces };

  // const chamfer_vectors = [],
  //   chamfer_faces = [],
  //   corner_faces = new Array(vertices.length);

  // for (let i = 0; i < vertices.length; ++i) corner_faces[i] = [];
  // for (let i = 0; i < faces.length; ++i) {
  //   const ii = faces[i],
  //     fl = ii.length - 1;
  //   const center_point = new Vector3();
  //   const face = new Array(fl);
  //   for (let j = 0; j < fl; ++j) {
  //     const vv = vertices[ii[j]].clone();
  //     center_point.add(vv);
  //     corner_faces[ii[j]].push((face[j] = chamfer_vectors.push(vv) - 1));
  //   }
  //   center_point.divideScalar(fl);
  //   for (let j = 0; j < fl; ++j) {
  //     const vv = chamfer_vectors[face[j]];
  //     vv.subVectors(vv, center_point)
  //       .multiplyScalar(chamfer)
  //       .addVectors(vv, center_point);
  //   }
  //   face.push(ii[fl]);
  //   chamfer_faces.push(face);
  // }
  // for (let i = 0; i < faces.length - 1; ++i) {
  //   for (let j = i + 1; j < faces.length; ++j) {
  //     const pairs = [];
  //     let lastm = -1;
  //     for (let m = 0; m < faces[i].length - 1; ++m) {
  //       const n = faces[j].indexOf(faces[i][m]);
  //       if (n >= 0 && n < faces[j].length - 1) {
  //         if (lastm >= 0 && m !== lastm + 1) pairs.unshift([i, m], [j, n]);
  //         else pairs.push([i, m], [j, n]);
  //         lastm = m;
  //       }
  //     }
  //     if (pairs.length !== 4) continue;
  //     chamfer_faces.push([
  //       chamfer_faces[pairs[0][0]][pairs[0][1]],
  //       chamfer_faces[pairs[1][0]][pairs[1][1]],
  //       chamfer_faces[pairs[3][0]][pairs[3][1]],
  //       chamfer_faces[pairs[2][0]][pairs[2][1]],
  //       -1,
  //     ]);
  //   }
  // }
  // for (let i = 0; i < corner_faces.length; ++i) {
  //   const cf = corner_faces[i],
  //     face = [cf[0]];
  //   let count = cf.length - 1;
  //   while (count) {
  //     for (let m = faces.length; m < chamfer_faces.length; ++m) {
  //       let index = chamfer_faces[m].indexOf(face[face.length - 1]);
  //       if (index >= 0 && index < 4) {
  //         if (--index === -1) index = 3;
  //         const next_vertex = chamfer_faces[m][index];
  //         if (cf.indexOf(next_vertex) >= 0) {
  //           face.push(next_vertex);
  //           break;
  //         }
  //       }
  //     }
  //     --count;
  //   }
  //   face.push(-1);
  //   chamfer_faces.push(face);
  // }
}
