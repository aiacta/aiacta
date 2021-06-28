export function extrudeWall(wall: {
  points: { x: number; y: number }[];
  thickness: number;
  height: number;
}) {
  const outline = wall.points
    .map((point, i, a) => {
      const prev = a[i - 1];
      const next = a[i + 1];

      const points = [];

      if (prev) {
        const vector = normalize([point.x - prev.x, point.y - prev.y]);

        vector[0] *= wall.thickness / 2;
        vector[1] *= wall.thickness / 2;

        const left = {
          x:
            point.x +
            vector[0] * Math.cos(Math.PI / 2) -
            vector[1] * Math.sin(Math.PI / 2),
          y:
            point.y +
            vector[0] * Math.sin(Math.PI / 2) +
            vector[1] * Math.cos(Math.PI / 2),
        };
        const right = {
          x:
            point.x +
            vector[0] * Math.cos(-Math.PI / 2) -
            vector[1] * Math.sin(-Math.PI / 2),
          y:
            point.y +
            vector[0] * Math.sin(-Math.PI / 2) +
            vector[1] * Math.cos(-Math.PI / 2),
        };

        points.push({ left, right });
      }

      if (next) {
        const vector = normalize([next.x - point.x, next.y - point.y]);

        vector[0] *= wall.thickness / 2;
        vector[1] *= wall.thickness / 2;

        const left = {
          x:
            point.x +
            vector[0] * Math.cos(Math.PI / 2) -
            vector[1] * Math.sin(Math.PI / 2),
          y:
            point.y +
            vector[0] * Math.sin(Math.PI / 2) +
            vector[1] * Math.cos(Math.PI / 2),
        };
        const right = {
          x:
            point.x +
            vector[0] * Math.cos(-Math.PI / 2) -
            vector[1] * Math.sin(-Math.PI / 2),
          y:
            point.y +
            vector[0] * Math.sin(-Math.PI / 2) +
            vector[1] * Math.cos(-Math.PI / 2),
        };

        points.push({ left, right });
      }

      return points;
    })
    .map((points, i, a) => {
      const prev = a[i - 1];
      const next = a[i + 1];

      if (!prev || !next) {
        return { left: [points[0].left], right: [points[0].right] };
      }

      const { left: prevLeft, right: prevRight } = prev.slice(-1)[0];
      const { left: nextLeft, right: nextRight } = next[0];

      const leftIntersect = intersect(
        prevLeft.x,
        prevLeft.y,
        points[0].left.x,
        points[0].left.y,
        nextLeft.x,
        nextLeft.y,
        points[1].left.x,
        points[1].left.y,
        wall.thickness,
      );

      const rightIntersect = intersect(
        prevRight.x,
        prevRight.y,
        points[0].right.x,
        points[0].right.y,
        nextRight.x,
        nextRight.y,
        points[1].right.x,
        points[1].right.y,
        wall.thickness,
      );

      return {
        left: leftIntersect,
        right: rightIntersect,
      };
    });

  const vertices = [
    ...outline.flatMap(({ left }) => left),
    ...outline.flatMap(({ right }) => right).reverse(),
  ];

  const faces = [];

  faces.push(
    ...vertices.flatMap((point, i, a) => {
      const next = a[i + 1] ?? a[0];

      return [
        point.x,
        point.y,
        0,

        point.x,
        point.y,
        wall.height,

        next.x,
        next.y,
        wall.height,

        next.x,
        next.y,
        wall.height,

        next.x,
        next.y,
        0,

        point.x,
        point.y,
        0,
      ];
    }),
  );

  faces.push(
    ...outline.flatMap(({ left, right }, i, a) => {
      const p = [...left, ...right];
      const next = a[i + 1];
      if (!next) {
        return [];
      }
      const top = [
        ...(p.length === 3
          ? [
              p[1].x,
              p[1].y,
              wall.height,
              p[2].x,
              p[2].y,
              wall.height,
              p[0].x,
              p[0].y,
              wall.height,
            ]
          : []),

        left.slice(-1)[0].x,
        left.slice(-1)[0].y,
        wall.height,

        right.slice(-1)[0].x,
        right.slice(-1)[0].y,
        wall.height,

        next.right[0].x,
        next.right[0].y,
        wall.height,

        next.right[0].x,
        next.right[0].y,
        wall.height,

        next.left[0].x,
        next.left[0].y,
        wall.height,

        left.slice(-1)[0].x,
        left.slice(-1)[0].y,
        wall.height,
      ];

      const bottom = [
        ...(p.length === 3
          ? [p[0].x, p[0].y, 0, p[2].x, p[2].y, 0, p[1].x, p[1].y, 0]
          : []),

        next.right[0].x,
        next.right[0].y,
        0,

        right.slice(-1)[0].x,
        right.slice(-1)[0].y,
        0,

        left.slice(-1)[0].x,
        left.slice(-1)[0].y,
        0,

        left.slice(-1)[0].x,
        left.slice(-1)[0].y,
        0,

        next.left[0].x,
        next.left[0].y,
        0,

        next.right[0].x,
        next.right[0].y,
        0,
      ];

      return [...top, ...bottom];
    }),
  );

  return {
    positions: faces,
    indices: faces.map((_, i) => i),
    uvs: Array.from({ length: faces.length / 3 }, (_, i) =>
      i % 2 === 0 ? [0, 0] : [1, 1],
    ).flat(),
  };
}

function normalize(vector: [number, number]) {
  const length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
  return [vector[0] / length, vector[1] / length];
}

function intersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  max = Number.MAX_SAFE_INTEGER,
) {
  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  const vector = [x2 - x, y2 - y];
  const distance = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);

  const vector2 = [x4 - x, y4 - y];
  const distance2 = Math.sqrt(vector2[0] ** 2 + vector2[1] ** 2);

  if (distance > max && ua > 1) {
    return [
      {
        x: x2 - (vector[0] / distance) * max,
        y: y2 - (vector[1] / distance) * max,
      },
      {
        x: x4 - (vector2[0] / distance2) * max,
        y: y4 - (vector2[1] / distance2) * max,
      },
    ];
  }

  return [
    {
      x,
      y,
    },
  ];
}
