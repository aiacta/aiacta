import { Vector3 } from 'three';

export type DieType = keyof typeof dice;

const p = (1 + Math.sqrt(5)) / 2;
const q = 1 / p;
const t = (1 + Math.sqrt(5)) / 2;

export const dice = {
  d4: {
    chamfer: 0.96,
    vertices: [
      new Vector3(1, 1, 1).normalize(),
      new Vector3(-1, -1, 1).normalize(),
      new Vector3(-1, 1, -1).normalize(),
      new Vector3(1, -1, -1).normalize(),
    ],
    faces: [
      { indices: [[1, 0, 2]], value: 1 },
      { indices: [[0, 1, 3]], value: 2 },
      { indices: [[0, 3, 2]], value: 3 },
      { indices: [[1, 2, 3]], value: 4 },
    ],
    uvTemplate: [
      [
        0.5 + Math.cos(((270 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((270 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((270 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((270 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((270 + 240) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((270 + 240) * Math.PI) / 180) * 0.5,
      ],
    ],
    faceHeight: 1,
    faceOffset: -40,
  },
  d6: {
    chamfer: 0.8,
    vertices: [
      new Vector3(-1, -1, -1).normalize(),
      new Vector3(1, -1, -1).normalize(),
      new Vector3(1, 1, -1).normalize(),
      new Vector3(-1, 1, -1).normalize(),
      new Vector3(-1, -1, 1).normalize(),
      new Vector3(1, -1, 1).normalize(),
      new Vector3(1, 1, 1).normalize(),
      new Vector3(-1, 1, 1).normalize(),
    ],
    faces: [
      {
        indices: [
          [0, 3, 2],
          [0, 2, 1],
        ],
        value: 1,
      },
      {
        indices: [
          [3, 7, 6],
          [3, 6, 2],
        ],
        value: 2,
      },
      {
        indices: [
          [0, 4, 7],
          [0, 7, 3],
        ],
        value: 3,
      },
      {
        indices: [
          [1, 2, 6],
          [1, 6, 5],
        ],
        value: 4,
      },
      {
        indices: [
          [0, 1, 5],
          [0, 5, 4],
        ],
        value: 5,
      },
      {
        indices: [
          [4, 5, 6],
          [4, 6, 7],
        ],
        value: 6,
      },
    ],
    uvTemplate: [[0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]],
    faceHeight: 3,
    faceOffset: 0,
  },
  d8: {
    chamfer: 0.965,
    vertices: [
      new Vector3(1, 0, 0).normalize(),
      new Vector3(-1, 0, 0).normalize(),
      new Vector3(0, 1, 0).normalize(),
      new Vector3(0, -1, 0).normalize(),
      new Vector3(0, 0, 1).normalize(),
      new Vector3(0, 0, -1).normalize(),
    ],
    faces: [
      { indices: [[0, 2, 4]], value: 1 },
      { indices: [[0, 3, 5]], value: 2 },
      { indices: [[0, 4, 3]], value: 3 },
      { indices: [[0, 5, 2]], value: 4 },
      { indices: [[1, 3, 4]], value: 5 },
      { indices: [[1, 2, 5]], value: 6 },
      { indices: [[1, 4, 2]], value: 7 },
      { indices: [[1, 5, 3]], value: 8 },
    ],
    uvTemplate: [
      [
        0.5 + Math.cos(((210 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 240) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 240) * Math.PI) / 180) * 0.5,
      ],
      [
        0.5 + Math.cos(((210 + 120 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 120 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 120 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 120 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 120 + 240) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 120 + 240) * Math.PI) / 180) * 0.5,
      ],
    ],
    faceHeight: 2,
    faceOffset: 0,
  },
  d10: {
    chamfer: 0.945,
    vertices: [
      ...Array.from({ length: 10 }, (_, i) =>
        new Vector3(
          Math.cos((i / 10) * Math.PI * 2),
          Math.sin((i / 10) * Math.PI * 2),
          0.105 * (i % 2 ? 1 : -1),
        ).normalize(),
      ),
      new Vector3(0, 0, -1).normalize(),
      new Vector3(0, 0, 1).normalize(),
    ],
    faces: [
      { indices: [[5, 7, 11]], value: 1 },
      { indices: [[4, 2, 10]], value: 2 },
      { indices: [[9, 1, 11]], value: 3 },
      { indices: [[8, 6, 10]], value: 4 },
      { indices: [[1, 3, 11]], value: 5 },
      { indices: [[6, 4, 10]], value: 6 },
      { indices: [[7, 9, 11]], value: 7 },
      { indices: [[2, 0, 10]], value: 8 },
      { indices: [[3, 5, 11]], value: 9 },
      { indices: [[0, 8, 10]], value: 10 },
      {
        indices: [
          [1, 0, 2],
          [1, 2, 3],
          [3, 2, 4],
          [3, 4, 5],
          [5, 4, 6],
          [5, 6, 7],
          [7, 6, 8],
          [7, 8, 9],
          [9, 8, 0],
          [9, 0, 1],
        ],
        value: 0,
      },
    ],
    uvTemplate: [
      [
        0.5 + Math.cos(((210 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 240) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 240) * Math.PI) / 180) * 0.5,
      ],
    ],
    faceHeight: 1.6,
    faceOffset: 0,
  },
  d12: {
    chamfer: 0.968,
    vertices: [
      new Vector3(0, q, p).normalize(),
      new Vector3(0, q, -p).normalize(),
      new Vector3(0, -q, p).normalize(),
      new Vector3(0, -q, -p).normalize(),
      new Vector3(p, 0, q).normalize(),
      new Vector3(p, 0, -q).normalize(),
      new Vector3(-p, 0, q).normalize(),
      new Vector3(-p, 0, -q).normalize(),
      new Vector3(q, p, 0).normalize(),
      new Vector3(q, -p, 0).normalize(),
      new Vector3(-q, p, 0).normalize(),
      new Vector3(-q, -p, 0).normalize(),
      new Vector3(1, 1, 1).normalize(),
      new Vector3(1, 1, -1).normalize(),
      new Vector3(1, -1, 1).normalize(),
      new Vector3(1, -1, -1).normalize(),
      new Vector3(-1, 1, 1).normalize(),
      new Vector3(-1, 1, -1).normalize(),
      new Vector3(-1, -1, 1).normalize(),
      new Vector3(-1, -1, -1).normalize(),
    ],
    faces: [
      {
        indices: [
          [2, 14, 4],
          [2, 4, 12],
          [2, 12, 0],
        ],
        value: 1,
      },
      {
        indices: [
          [13, 8, 12],
          [13, 12, 4],
          [13, 4, 5],
        ],
        value: 2,
      },
      {
        indices: [
          [0, 12, 8],
          [0, 8, 10],
          [0, 10, 16],
        ],
        value: 3,
      },
      {
        indices: [
          [5, 4, 14],
          [5, 14, 9],
          [5, 9, 15],
        ],
        value: 4,
      },
      {
        indices: [
          [6, 18, 2],
          [6, 2, 0],
          [6, 0, 16],
        ],
        value: 5,
      },
      {
        indices: [
          [18, 11, 9],
          [18, 9, 14],
          [18, 14, 2],
        ],
        value: 6,
      },
      {
        indices: [
          [1, 17, 10],
          [1, 10, 8],
          [1, 8, 13],
        ],
        value: 7,
      },
      {
        indices: [
          [1, 13, 5],
          [1, 5, 15],
          [1, 15, 3],
        ],
        value: 8,
      },
      {
        indices: [
          [16, 10, 17],
          [16, 17, 7],
          [16, 7, 6],
        ],
        value: 9,
      },
      {
        indices: [
          [15, 9, 11],
          [15, 11, 19],
          [15, 19, 3],
        ],
        value: 10,
      },
      {
        indices: [
          [6, 7, 19],
          [6, 19, 11],
          [6, 11, 18],
        ],
        value: 11,
      },
      {
        indices: [
          [3, 19, 7],
          [3, 7, 17],
          [3, 17, 1],
        ],
        value: 12,
      },
    ],
    uvTemplate: [
      [
        0.5 + Math.cos(((18 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 72) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 72) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 144) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 144) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 144) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 144) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 216) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 216) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 216) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 216) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((18 + 288) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((18 + 288) * Math.PI) / 180) * 0.5,
      ],
    ],
    faceHeight: 2.1,
    faceOffset: 0,
  },
  d20: {
    chamfer: 0.955,
    vertices: [
      new Vector3(-1, t, 0).normalize(),
      new Vector3(1, t, 0).normalize(),
      new Vector3(-1, -t, 0).normalize(),
      new Vector3(1, -t, 0).normalize(),
      new Vector3(0, -1, t).normalize(),
      new Vector3(0, 1, t).normalize(),
      new Vector3(0, -1, -t).normalize(),
      new Vector3(0, 1, -t).normalize(),
      new Vector3(t, 0, -1).normalize(),
      new Vector3(t, 0, 1).normalize(),
      new Vector3(-t, 0, -1).normalize(),
      new Vector3(-t, 0, 1).normalize(),
    ],
    faces: [
      { indices: [[0, 11, 5]], value: 1 },
      { indices: [[7, 1, 8]], value: 2 },
      { indices: [[0, 1, 7]], value: 3 },
      { indices: [[0, 7, 10]], value: 4 },
      { indices: [[1, 5, 9]], value: 5 },
      { indices: [[0, 10, 11]], value: 6 },
      { indices: [[5, 11, 4]], value: 7 },
      { indices: [[11, 10, 2]], value: 8 },
      { indices: [[10, 7, 6]], value: 9 },
      { indices: [[3, 4, 2]], value: 10 },
      { indices: [[3, 2, 6]], value: 11 },
      { indices: [[3, 9, 4]], value: 12 },
      { indices: [[0, 5, 1]], value: 13 },
      { indices: [[3, 6, 8]], value: 14 },
      { indices: [[4, 9, 5]], value: 15 },
      { indices: [[3, 8, 9]], value: 16 },
      { indices: [[2, 4, 11]], value: 17 },
      { indices: [[6, 2, 10]], value: 18 },
      { indices: [[8, 6, 7]], value: 19 },
      { indices: [[9, 8, 1]], value: 20 },
    ],
    uvTemplate: [
      [
        0.5 + Math.cos(((210 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 0) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 120) * Math.PI) / 180) * 0.5,
        0.5 + Math.cos(((210 + 240) * Math.PI) / 180) * 0.5,
        0.5 + Math.sin(((210 + 240) * Math.PI) / 180) * 0.5,
      ],
    ],
    faceHeight: 1.2,
    faceOffset: 0,
  },
};
