import { Body, World } from 'cannon-es';
import { DieType } from '../Dice/dieValues';
import { createDie } from '../Dice/factory';
import {
  calculateFaceValue,
  calculateQuaternionForResult,
  calculateResults,
} from './diceCalculation';
import { createWorld, DieMaterial } from './world';

describe('Physics', () => {
  describe('Dice', () => {
    it('d4 should land on 4', () => {
      const world = createWorld(100, 100);

      const die = createTestDie(world, {
        type: 'd4',
        position: [0, 0, 10],
        rotation: [0, 0, 0],
      });

      const results = calculateResults(world, [die]);

      expect(results.get(die)).toMatchInlineSnapshot(`
        Object {
          "position": Vec3 {
            "x": -0.3677903660872074,
            "y": -0.33575189720274673,
            "z": 0.33331208872095824,
          },
          "quaternion": Quaternion {
            "w": 0.8880634355334616,
            "x": 0.32348945448994854,
            "y": -0.3266184860819115,
            "z": -0.004274558674424151,
          },
          "value": 4,
        }
      `);
    });

    it.skip('d4 that would land on a 4 lands on target value on same position', () => {
      const world = createWorld(100, 100);

      const die = createTestDie(world, {
        type: 'd4',
        position: [0, 0, 10],
        rotation: [0, 0, 0],
      });

      const results = calculateResults(world, [die]);

      expect(results.get(die)).toMatchInlineSnapshot(`
        Object {
          "position": Vec3 {
            "x": -0.3677903660872074,
            "y": -0.33575189720274673,
            "z": 0.33331208872095824,
          },
          "quaternion": Quaternion {
            "w": 0.8880634355334616,
            "x": 0.32348945448994854,
            "y": -0.3266184860819115,
            "z": -0.004274558674424151,
          },
          "value": 4,
        }
      `);

      die.body.quaternion = calculateQuaternionForResult(die.body, 4, 1)!;

      expect(calculateResults(world, [die]).get(die)).toMatchInlineSnapshot(`
        Object {
          "position": Vec3 {
            "x": -0.3677903660872074,
            "y": -0.33575189720274673,
            "z": 0.33331208872095824,
          },
          "quaternion": Quaternion {
            "w": -0.32504116454445825,
            "x": -0.0000447937443138725,
            "y": 0.8880738435782803,
            "z": -0.3250739726542301,
          },
          "value": 1,
        }
      `);
    });

    it.each`
      type    | rotation        | rolled | target
      ${'d4'} | ${[-36, 45, 0]} | ${3}   | ${1}
      ${'d4'} | ${[-36, 45, 0]} | ${3}   | ${2}
      ${'d4'} | ${[-36, 45, 0]} | ${3}   | ${3}
      ${'d4'} | ${[-36, 45, 0]} | ${3}   | ${4}
      ${'d6'} | ${[180, 0, 0]}  | ${1}   | ${1}
      ${'d6'} | ${[180, 0, 0]}  | ${1}   | ${2}
      ${'d6'} | ${[180, 0, 0]}  | ${1}   | ${3}
      ${'d6'} | ${[180, 0, 0]}  | ${1}   | ${4}
      ${'d6'} | ${[180, 0, 0]}  | ${1}   | ${5}
      ${'d6'} | ${[180, 0, 0]}  | ${1}   | ${6}
      ${'d6'} | ${[90, 0, 0]}   | ${2}   | ${1}
      ${'d6'} | ${[90, 0, 0]}   | ${2}   | ${2}
      ${'d6'} | ${[90, 0, 0]}   | ${2}   | ${3}
      ${'d6'} | ${[90, 0, 0]}   | ${2}   | ${4}
      ${'d6'} | ${[90, 0, 0]}   | ${2}   | ${5}
      ${'d6'} | ${[90, 0, 0]}   | ${2}   | ${6}
      ${'d6'} | ${[0, 90, 0]}   | ${3}   | ${1}
      ${'d6'} | ${[0, 90, 0]}   | ${3}   | ${2}
      ${'d6'} | ${[0, 90, 0]}   | ${3}   | ${3}
      ${'d6'} | ${[0, 90, 0]}   | ${3}   | ${4}
      ${'d6'} | ${[0, 90, 0]}   | ${3}   | ${5}
      ${'d6'} | ${[0, 90, 0]}   | ${3}   | ${6}
      ${'d6'} | ${[0, -90, 0]}  | ${4}   | ${1}
      ${'d6'} | ${[0, -90, 0]}  | ${4}   | ${2}
      ${'d6'} | ${[0, -90, 0]}  | ${4}   | ${3}
      ${'d6'} | ${[0, -90, 0]}  | ${4}   | ${4}
      ${'d6'} | ${[0, -90, 0]}  | ${4}   | ${5}
      ${'d6'} | ${[0, -90, 0]}  | ${4}   | ${6}
      ${'d6'} | ${[-90, 0, 0]}  | ${5}   | ${1}
      ${'d6'} | ${[-90, 0, 0]}  | ${5}   | ${2}
      ${'d6'} | ${[-90, 0, 0]}  | ${5}   | ${3}
      ${'d6'} | ${[-90, 0, 0]}  | ${5}   | ${4}
      ${'d6'} | ${[-90, 0, 0]}  | ${5}   | ${5}
      ${'d6'} | ${[-90, 0, 0]}  | ${5}   | ${6}
      ${'d6'} | ${[0, 0, 0]}    | ${6}   | ${1}
      ${'d6'} | ${[0, 0, 0]}    | ${6}   | ${2}
      ${'d6'} | ${[0, 0, 0]}    | ${6}   | ${3}
      ${'d6'} | ${[0, 0, 0]}    | ${6}   | ${4}
      ${'d6'} | ${[0, 0, 0]}    | ${6}   | ${5}
      ${'d6'} | ${[0, 0, 0]}    | ${6}   | ${6}
    `(
      'it should move a $type to correct rotation when $rolled is rolled with rotation $rotation and target is $target',
      ({ type, rotation, rolled, target }: any) => {
        const world = createWorld(100, 100);

        const die = createTestDie(world, {
          type: type,
          position: [0, 0, 10],
          rotation,
        });
        const value = calculateFaceValue(die.body, type === 'd4' ? -1 : 1);

        expect(value).toBe(rolled);

        const quaternion = calculateQuaternionForResult(
          die.body,
          rolled,
          target,
        );

        die.body.quaternion = quaternion!;

        expect(calculateFaceValue(die.body, type === 'd4' ? -1 : 1)).toBe(
          target,
        );
      },
    );
  });
});

function createTestDie(
  world: World,
  {
    type,
    position,
    quaternion,
    rotation = [0, 0, 0],
  }: {
    type: DieType;
    position: number[];
    quaternion?: number[];
    rotation?: number[];
  },
) {
  const errorfn = console.error;
  console.error = () => {
    // swallow jsdom errors ...
  };
  const { shape } = createDie(type);
  console.error = errorfn;

  const body = new Body({ mass: 1 });
  body.position.set(position[0], position[1], position[2]);
  body.quaternion.setFromEuler(
    (rotation[0] / 180) * Math.PI,
    (rotation[1] / 180) * Math.PI,
    (rotation[2] / 180) * Math.PI,
  );
  if (quaternion) {
    body.quaternion.set(
      quaternion[0],
      quaternion[1],
      quaternion[2],
      quaternion[3],
    );
  }
  body.material = DieMaterial;
  body.addShape(shape);
  body.sleepSpeedLimit = 1;

  world.addBody(body);

  return { body, type };
}
