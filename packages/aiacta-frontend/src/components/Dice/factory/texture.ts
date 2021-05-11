import { BufferAttribute, Vector2 } from 'three';

const debug = false;

export function createTextureDataURL({
  uvAttribute,
  faceValues,
  faceHeight = 1,
  faceOffset = 0,
  index = new BufferAttribute(
    new Uint16Array(new Array(uvAttribute.count).fill(null).map((_, i) => i)),
    1,
    false,
  ),
  d4,
}: {
  uvAttribute: BufferAttribute;
  faceValues: { [key: number]: number };
  faceHeight?: number;
  faceOffset?: number;
  index?: BufferAttribute;
  d4?: boolean;
}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const width = 1024;
  const height = 1024;

  canvas.width = width;
  canvas.height = width;

  if (!ctx) {
    return '';
  }

  ctx.textAlign = 'center';

  ctx.fillStyle = 'rgb( 255, 0, 0 )';
  ctx.fillRect(0, 0, width, height);

  const faces = Object.keys(faceValues).map((i) => [
    new Vector2().fromBufferAttribute(uvAttribute, index.getX(+i * 3)),
    new Vector2().fromBufferAttribute(uvAttribute, index.getX(+i * 3 + 1)),
    new Vector2().fromBufferAttribute(uvAttribute, index.getX(+i * 3 + 2)),
  ]);

  const faceGroups = Object.entries(faceValues).reduce((acc, [i, value]) => {
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(faces[+i]);
    return acc;
  }, {} as { [value: number]: Vector2[][] });

  const abc = 'abc';
  const a = new Vector2();
  const b = new Vector2();

  if (debug) {
    const uvs = [new Vector2(), new Vector2(), new Vector2()];

    const face: number[] = [];

    for (let i = 0, il = index.count; i < il; i += 3) {
      face[0] = index.getX(i);
      face[1] = index.getX(i + 1);
      face[2] = index.getX(i + 2);

      uvs[0].fromBufferAttribute(uvAttribute, face[0]);
      uvs[1].fromBufferAttribute(uvAttribute, face[1]);
      uvs[2].fromBufferAttribute(uvAttribute, face[2]);

      processFace(ctx, face, uvs, i / 3);
    }
  }

  const distinct6and9 = Math.max(...Object.values(faceValues)) >= 9;

  Object.entries(faceGroups).forEach(([value, faces]) => {
    const center = new Vector2();
    faces.forEach((uvs) => {
      ctx.fillStyle = 'rgb( 255, 63, 63 )';
      ctx.beginPath();
      uvs.forEach((uv) => {
        center.add(uv);
        ctx.lineTo(uv.x * width, (1 - uv.y) * height);
      });
      ctx.closePath();
      if (!debug) {
        ctx.fill();
      }
    });
    center.divideScalar(faces.flat().length);

    ctx.save();
    ctx.font = `${60 * faceHeight}px Arial`;
    const {
      actualBoundingBoxAscent,
      actualBoundingBoxDescent,
    } = ctx.measureText(`${value}`);
    const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
    ctx.fillStyle = 'rgb( 63, 255, 63 )';
    ctx.translate(
      center.x * width,
      (1 - center.y) * height + textHeight / 2 + (d4 ? 0 : faceOffset),
    );
    if (d4) {
      ctx.translate(0, -textHeight / 2);
      const { dir, offset } = {
        1: { dir: 1, offset: 2.0944 * 1 },
        2: { dir: -1, offset: 2.0944 * 2 },
        3: { dir: 1, offset: 2.0944 * 2 },
        4: { dir: -1, offset: 2.0944 * 0 },
      }[+value as 1 | 2 | 3 | 4];

      ctx.save();
      ctx.rotate(dir * 2.0944 + offset);
      ctx.translate(0, -70 + faceOffset);
      ctx.rotate(Math.PI);
      ctx.scale(1, -1);
      ctx.fillText(`${((+value + 0) % 4) + 1}`, 0, 0);
      ctx.restore();

      ctx.save();
      ctx.rotate(dir * 2.0944 * 2 + offset);
      ctx.translate(0, -70 + faceOffset);
      ctx.rotate(Math.PI);
      ctx.scale(1, -1);
      ctx.fillText(`${((+value + 1) % 4) + 1}`, 0, 0);
      ctx.restore();

      ctx.rotate(dir * 2.0944 * 3 + offset);
      ctx.translate(0, -70 + faceOffset);
      ctx.rotate(Math.PI);
      ctx.scale(1, -1);
      ctx.fillText(`${((+value + 2) % 4) + 1}`, 0, 0);
    } else {
      ctx.rotate(Math.PI);
      ctx.translate(0, textHeight);
      ctx.scale(-1, 1);
      ctx.fillText(`${value}`, 0, 0);
      if ((distinct6and9 && +value === 6) || +value === 9) {
        ctx.translate(20 * faceHeight, 0);
        ctx.fillText('.', 0, 0);
      }
    }

    ctx.restore();
  });

  const dataUrl = canvas.toDataURL('image/png');

  if (debug) {
    const id = `debug${JSON.stringify(faceValues)}`;
    let img = document.getElementById(id) as HTMLImageElement | null;
    if (!img) {
      img = document.createElement('img');
      img.id = id;
      document.body.appendChild(img);
    }
    img.src = dataUrl;
  }

  return dataUrl;

  function processFace(
    ctx: CanvasRenderingContext2D,
    face: number[],
    uvs: Vector2[],
    index: number,
  ) {
    // draw contour of face

    ctx.beginPath();

    a.set(0, 0);

    for (let j = 0, jl = uvs.length; j < jl; j++) {
      const uv = uvs[j];

      a.x += uv.x;
      a.y += uv.y;

      if (j === 0) {
        ctx.moveTo(uv.x * (width - 2) + 0.5, (1 - uv.y) * (height - 2) + 0.5);
      } else {
        ctx.lineTo(uv.x * (width - 2) + 0.5, (1 - uv.y) * (height - 2) + 0.5);
      }
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = 'rgb( 0, 100, 0 )';
    ctx.fill();

    // calculate center of face

    a.divideScalar(uvs.length);

    // label the face number

    ctx.font = '40px Arial';
    ctx.fillStyle = 'rgb( 222, 63, 63 )';
    ctx.fillText(`${index}`, a.x * width, (1 - a.y) * height);

    //

    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgb( 191, 191, 191 )';

    // label uv edge orders

    for (let j = 0, jl = uvs.length; j < jl; j++) {
      const uv = uvs[j];
      b.addVectors(a, uv).divideScalar(2);

      const vnum = face[j];
      ctx.fillText(abc[j] + vnum, b.x * width, (1 - b.y) * height);

      if (b.x > 0.95) {
        // wrap x

        ctx.fillText(abc[j] + vnum, (b.x % 1) * width, (1 - b.y) * height);
      }
    }
  }
}
