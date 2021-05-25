import { ConvexPolyhedron, Vec3 } from 'cannon-es';
import { dice, DieType } from './dieValues';

export function createShape(die: DieType) {
  const vertices: Vec3[] = dice[die].vertices.map(
    (v) => new Vec3(...v.toArray()),
  );

  const shape = new ConvexPolyhedron({
    faces: dice[die].faces.flatMap((f) => {
      return f.indices.map((indices) => {
        (indices as any).faceValue = f.value;
        return indices;
      });
    }),
    vertices,
  });

  return shape;
}
