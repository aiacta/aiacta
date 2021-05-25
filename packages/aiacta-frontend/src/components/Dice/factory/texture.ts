import { BufferAttribute, Vector2 } from 'three';
import { dice, DieType } from './dieValues';

const textureWidth = 256;
const textureHeight = 256;

const debug = false;

const textureBgStyle = 'rgb( 255, 63, 63 )';

export function createTextures(die: DieType, vertexCount: number) {
  const dataUrls: string[] = [];

  const { uvTemplate, faces } = dice[die];

  const distinct6and9 =
    Math.max(...Object.values(faces.map((g) => g.value))) >= 9;

  const uvs = faces
    .filter(({ value }) => value > 0)
    .flatMap(({ indices, value }, groupIdx) => {
      const uvVertices = indices.flat().flatMap((_, vertexIdx) => {
        const vertices: Vector2[] = [];
        const template = uvTemplate[groupIdx % uvTemplate.length].slice(
          vertexIdx * 2,
          vertexIdx * 2 + 2,
        );
        for (let i = 0; i < template.length; i += 2) {
          vertices.push(new Vector2(template[i], template[i + 1]));
        }
        return vertices;
      });

      const canvas = document.createElement('canvas');
      canvas.width = textureWidth;
      canvas.height = textureHeight;
      const ctx = canvas.getContext('2d')!;

      ctx.font = '15px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = debug ? 'white' : textureBgStyle;
      ctx.fillRect(0, 0, textureWidth, textureHeight);

      const center = new Vector2();

      ctx.fillStyle = textureBgStyle;
      ctx.beginPath();
      uvVertices.forEach((uv) => {
        center.add(uv);
        ctx.lineTo(uv.x * textureWidth, (1 - uv.y) * textureHeight);
      });
      ctx.closePath();
      ctx.fill();

      center.divideScalar(uvVertices.length);

      const debugDrawCalls: (() => void)[] = [];

      if (debug) {
        // paint every three vertice-groups
        const debugColors = [
          'midnightblue',
          'darkgreen',
          'red',
          'gold',
          'lime',
          'aqua',
          'fuchsia',
          'lightpink',
        ];

        for (let i = 0; i < uvVertices.length; i += 3) {
          ctx.beginPath();
          ctx.fillStyle = debugColors[Math.floor(i / 3) % debugColors.length];
          const center = new Vector2()
            .add(uvVertices[i])
            .add(uvVertices[i + 1])
            .add(uvVertices[i + 2])
            .divideScalar(3);
          debugAddVertex(i, uvVertices[i], center);
          debugAddVertex(i + 1, uvVertices[i + 1], center);
          debugAddVertex(i + 2, uvVertices[i + 2], center);
          ctx.closePath();
          ctx.fill();
        }
        ctx.lineWidth = 2;
        ctx.font = '15px Arial';
        ctx.strokeStyle = 'white';
        debugDrawCalls.forEach((cb) => cb());
      }

      function debugAddVertex(num: number, vertex: Vector2, center: Vector2) {
        ctx.lineTo(vertex.x * textureWidth, (1 - vertex.y) * textureHeight);
        const fillStyle = ctx.fillStyle;
        debugDrawCalls.push(() => {
          ctx.fillStyle = fillStyle;
          const cv = vertex
            .clone()
            .add(center.clone().sub(vertex).multiplyScalar(0.2));
          ctx.strokeText(
            num.toString(),
            cv.x * textureWidth,
            (1 - cv.y) * textureHeight,
          );
          ctx.fillText(
            num.toString(),
            cv.x * textureWidth,
            (1 - cv.y) * textureHeight,
          );
        });
      }

      const { faceHeight, faceOffset } = dice[die];

      ctx.save();

      ctx.font = `${60 * faceHeight}px Arial`;
      const { actualBoundingBoxAscent, actualBoundingBoxDescent } =
        ctx.measureText(`${value}`);
      const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
      ctx.fillStyle = 'rgb( 63, 255, 63 )';
      ctx.translate(
        center.x * textureWidth,
        (1 - center.y) * textureHeight +
          textHeight / 2 +
          (die === 'd4' ? 0 : faceOffset),
      );
      if (die === 'd4') {
        ctx.translate(0, -textHeight / 2);
        const { dir, offset } = {
          1: { dir: -1, offset: 2.0944 * 0 },
          2: { dir: 1, offset: 2.0944 * 2 },
          3: { dir: -1, offset: 2.0944 * 2 },
          4: { dir: 1, offset: 2.0944 * 1 },
        }[value as 1 | 2 | 3 | 4];

        ctx.save();
        ctx.rotate(2.0944 * 0.5 + dir * 2.0944 + offset);
        ctx.translate(0, -10 + faceOffset);
        ctx.fillText(`${((value + 0) % 4) + 1}`, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.rotate(2.0944 * 0.5 + dir * 2.0944 * 2 + offset);
        ctx.translate(0, -10 + faceOffset);
        ctx.fillText(`${((value + 1) % 4) + 1}`, 0, 0);
        ctx.restore();

        ctx.rotate(2.0944 * 0.5 + dir * 2.0944 * 3 + offset);
        ctx.translate(0, -10 + faceOffset);
        ctx.fillText(`${((value + 2) % 4) + 1}`, 0, 0);
      } else {
        ctx.fillText(
          die === 'd10' && value === 10 ? `0` : `${value}`,
          center.x,
          center.y,
        );
        if (distinct6and9 && (value === 6 || value === 9)) {
          ctx.translate(20 * faceHeight, 0);
          ctx.fillText('.', 0, 0);
        }
      }

      ctx.restore();

      dataUrls.push(canvas.toDataURL());

      return uvVertices;
    });

  if (debug) {
    for (const [idx, dataUrl] of dataUrls.entries()) {
      const id = `debug${die}_${idx}`;
      let img = document.getElementById(id) as HTMLImageElement | null;
      if (!img) {
        img = document.createElement('img');
        img.id = id;
        document.body.appendChild(img);
      }
      img.src = dataUrl;
    }
  }

  // fill uvs with empty slots for extra vertices
  uvs.length = vertexCount * 2;

  return {
    uv: new BufferAttribute(
      new Float32Array(uvs.flatMap((uvs) => uvs.toArray())),
      2,
      false,
    ),
    textureDataUrls: dataUrls,
  };
}
