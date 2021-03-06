import { Body, ConvexPolyhedron, Vec3, World } from 'cannon-es';
import { createShape } from './factory/shape';
import {
  angularDamping,
  createWorld,
  DieMaterial,
  linearDamping,
} from './world';

let world: World;
let calculatingNewDice = false;

const shapes = {
  d4: createShape('d4'),
  d6: createShape('d6'),
  d8: createShape('d8'),
  d10: createShape('d10'),
  d12: createShape('d12'),
  d20: createShape('d20'),
};

const simSpeed = 1 / 120;

self.addEventListener('message', (msg) => {
  const { op, ...data } = msg.data;
  switch (op) {
    case 'init': {
      const { width = 100, height = 100 } = data;
      world = createWorld(width, height);
      // todo copy old bodies?
      break;
    }
    case 'addDice': {
      const { dice } = data as {
        dice: {
          id: string;
          type: string;
          idx: number;
          position: [number, number, number];
          quaternion: [number, number, number, number];
          velocity: [number, number, number];
          angularVelocity: [number, number, number];
        }[];
      };

      const diceBodies = dice.map((die) => {
        const body = new Body({ mass: 10 });

        body.addShape(shapes[die.type as keyof typeof shapes]);

        body.position.set(...die.position);
        body.quaternion.set(...die.quaternion);
        body.velocity.set(...die.velocity);
        body.angularVelocity.set(...die.angularVelocity);

        body.material = DieMaterial;
        body.sleepSpeedLimit = 10;
        body.linearDamping = linearDamping;
        body.angularDamping = angularDamping;
        (body as any).dieId = die.id;
        (body as any).bufferIndex = die.idx;

        body.addEventListener('collide', (event: any) => {
          if (!calculatingNewDice) {
            (self as any).postMessage({
              op: 'collision',
              id: die.id,
              body: { velocity: event.body.velocity.toArray() },
              target: { velocity: event.target.velocity.toArray() },
              contact: { restitution: event.contact.restitution },
            });
          }
        });

        body.addEventListener('sleep', () => {
          if (!calculatingNewDice) {
            (self as any).postMessage({
              op: 'sleep',
              id: die.id,
            });
          }
        });
        body.addEventListener('wakeup', () => {
          if (!calculatingNewDice) {
            (self as any).postMessage({
              op: 'wakeup',
              id: die.id,
            });
          }
        });

        world.addBody(body);

        return {
          ...die,
          body,
        };
      });

      const { results, iteration } = calculateResults(diceBodies);

      (self as any).postMessage({
        op: 'roll',
        results: results.map(({ id, rolledValue }) => ({ id, rolledValue })),
        iteration,
      });

      break;
    }
    case 'removeDie': {
      const { id } = data;

      const body = world.bodies.find((body) => (body as any).dieId === id);
      if (body) {
        world.removeBody(body);
      }

      break;
    }
    case 'step': {
      const { positions, quaternions } = data;

      if (world) {
        world.step(simSpeed);

        world.bodies.forEach((body) => {
          const idx = (body as any).bufferIndex;
          if (typeof idx === 'number') {
            positions[idx * 3 + 0] = body.position.x;
            positions[idx * 3 + 1] = body.position.y;
            positions[idx * 3 + 2] = body.position.z;

            quaternions[idx * 4 + 0] = body.quaternion.x;
            quaternions[idx * 4 + 1] = body.quaternion.y;
            quaternions[idx * 4 + 2] = body.quaternion.z;
            quaternions[idx * 4 + 3] = body.quaternion.w;
          }
        });
      }

      (self as any).postMessage(
        {
          op: 'frame',
          positions,
          quaternions,
        },
        [positions.buffer, quaternions.buffer],
      );
      break;
    }
  }
});

function calculateResults(dice: { id: string; body: Body; type: string }[]) {
  calculatingNewDice = true;

  const vectorsPreCalculation = new Map(
    world.bodies.map((body) => [
      body,
      {
        position: body.position.clone(),
        quaternion: body.quaternion.clone(),
        velocity: body.velocity.clone(),
        angularVelocity: body.angularVelocity.clone(),
      },
    ]),
  );

  let iteration = 0;
  do {
    world.step(simSpeed);
  } while (world.hasActiveBodies && ++iteration < 10000);

  if (iteration >= 10000) {
    console.log('Could not settle dice', world.hasActiveBodies, iteration);
  }

  const results = dice.map((die) => {
    const { body, type } = die;
    const value = calculateFaceValue(body, type === 'd4' ? -1 : 1);
    if (!value) {
      console.log('No face found');
    }
    return { ...die, rolledValue: value };
  });

  world.bodies.forEach((body) => {
    body.position = vectorsPreCalculation.get(body)!.position;
    body.quaternion = vectorsPreCalculation.get(body)!.quaternion;
    body.velocity = vectorsPreCalculation.get(body)!.velocity;
    body.angularVelocity = vectorsPreCalculation.get(body)!.angularVelocity;
    body.wakeUp();
  });

  calculatingNewDice = false;

  return { results, iteration };
}

function calculateFaceValue(body: Body, upside: -1 | 1) {
  const shape = body.shapes[0] as ConvexPolyhedron;
  const faces = shape.faces as any as (number[] & {
    faceValue: number;
  })[];
  const upVec = new Vec3(0, 0, upside);
  let closestFace = -1;
  let closestD = -1;
  for (const [idx, faceNormal] of shape.faceNormals.entries()) {
    const worldNormal = body.quaternion.vmult(faceNormal);
    const d = worldNormal.dot(upVec);
    if (d > closestD && faces[idx]?.faceValue) {
      closestFace = idx;
      closestD = d;
    }
  }
  if (closestFace >= 0) {
    if (closestD < 1 - 1e-3) {
      console.warn('No face straight up landed, using closest face');
    }
    return faces[closestFace].faceValue;
  } else {
    return null;
  }
}

export {};
