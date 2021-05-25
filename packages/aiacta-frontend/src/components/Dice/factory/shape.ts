import { ConvexPolyhedron, Vec3 } from 'cannon-es';
import { dice, DieType } from './dieValues';

export function createShape(die: DieType) {
  const vertices: Vec3[] = [];

  const shape = new ConvexPolyhedron({
    faces: dice[die].faces.flatMap((f) => {
      return f.indices.map((i) => {
        const arr = i.map((idx) => {
          const pos = new Vec3().copy(dice[die].vertices[idx] as any);
          const vi = vertices.findIndex((v) => v.almostEquals(pos));
          if (vi >= 0) {
            return vi;
          } else {
            return vertices.push(pos) - 1;
          }
        });
        (arr as any).faceValue = f.value;
        return arr;
      });
    }),
    vertices,
  });

  return shape;
}
