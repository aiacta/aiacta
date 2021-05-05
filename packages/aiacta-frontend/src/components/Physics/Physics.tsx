import { useAspect } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Body, Shape, World } from 'cannon-es';
import * as React from 'react';
import { Object3D } from 'three';
import {
  calculateQuaternionForResult,
  calculateResults,
} from './diceCalculation';
import { createWorld, DieMaterial } from './world';

type CalculationOptions = { body: Body; type: string; targetValue: number };

const context = React.createContext({
  world: new World(),
  precalculateDie(_opts: CalculationOptions) {
    // noop
  },
});

export function Physics({
  gravity = -100,
  children,
}: {
  gravity?: number;
  children: React.ReactNode;
}) {
  const aspect = useAspect(
    100,
    (100 * window.innerHeight) / window.innerWidth,
    0.8,
  );
  const [world] = React.useState(() =>
    createWorld(aspect[0], aspect[1], gravity),
  );

  const precalculationDice = React.useRef<
    {
      body: Body;
      type: string;
      targetValue: number;
    }[]
  >();
  const api = React.useMemo(
    () => ({
      world,
      precalculateDie(opts: CalculationOptions) {
        if (!precalculationDice.current) {
          precalculationDice.current = [opts];
          setImmediate(() => {
            const results = calculateResults(
              world,
              precalculationDice.current!,
            );
            precalculationDice.current!.forEach((die) => {
              const { body, targetValue } = die;
              if (results.has(die)) {
                console.log('die landed on', results.get(die)!.value);
                const rotationQuaternion = calculateQuaternionForResult(
                  body,
                  results.get(die)!.value,
                  targetValue,
                );
                if (rotationQuaternion) {
                  body.quaternion = rotationQuaternion;
                }
              }
            });
            precalculationDice.current = undefined;
            // const vectorsPreCalculation = world.bodies.map((body) => ({
            //   position: body.position.clone(),
            //   quaternion: body.quaternion.clone(),
            //   velocity: body.velocity.clone(),
            //   angularVelocity: body.angularVelocity.clone(),
            // }));
            // let iteration = 0;
            // do {
            //   world.step(1 / 60);
            // } while (world.hasActiveBodies && ++iteration < 1000000);
            // const quaternions = new Map<Body, CannonQuaternion>();
            // precalculationDice.current?.forEach(
            //   ({ body, object, faceValues, targetValue, rotationKeys }) => {
            //     object.position.fromArray(body.position.toArray());
            //     object.quaternion.fromArray(body.quaternion.toArray());
            //     if (object instanceof Mesh) {
            //       const upVec = new Vec3(0, 0, -1);
            //       let closestFace = -1;
            //       for (const [idx, faceNormal] of (body
            //         .shapes[0] as ConvexPolyhedron).faceNormals.entries()) {
            //         const worldNormal = body.quaternion.vmult(faceNormal);
            //         if (worldNormal.dot(upVec) >= 1 - 1e-3) {
            //           closestFace = idx;
            //           break;
            //         }
            //       }
            //       if (!faceValues[closestFace]) {
            //         console.log('no faces');
            //         console.log(
            //           'rotate die',
            //           'face:',
            //           closestFace,
            //           'calc:',
            //           'target:',
            //           targetValue,
            //         );
            //         return;
            //       }
            //       const calculatedValue = faceValues[closestFace];
            //       console.log('calculated:', calculatedValue);
            //       if (calculatedValue !== targetValue) {
            //         const rotationKey = [calculatedValue, targetValue]
            //           .sort()
            //           .join(',');
            //         const rot = new Quaternion().setFromEuler(
            //           new Euler(...rotationKeys[rotationKey]),
            //         );
            //         if (targetValue > calculatedValue) {
            //           rot.invert();
            //         }
            //         quaternions.set(
            //           body,
            //           new CannonQuaternion(rot.x, rot.y, rot.z, rot.w),
            //         );
            //       }
            //     }
            //   },
            // );
            // precalculationDice.current = undefined;
            // vectorsPreCalculation.forEach((vectors, idx) => {
            //   world.bodies[idx].position.copy(vectors.position);
            //   if (quaternions.has(world.bodies[idx])) {
            //     world.bodies[idx].quaternion.copy(
            //       world.bodies[idx].quaternion.mult(
            //         quaternions.get(world.bodies[idx])!,
            //       ),
            //     );
            //   } else {
            //     world.bodies[idx].quaternion.copy(vectors.quaternion);
            //   }
            //   world.bodies[idx].velocity.copy(vectors.velocity);
            //   world.bodies[idx].angularVelocity.copy(vectors.angularVelocity);
            //   world.bodies[idx].wakeUp();
            // });
          });
        } else {
          precalculationDice.current.push(opts);
        }
      },
    }),
    [world],
  );

  useFrame(() => {
    if (!precalculationDice.current) {
      world.step(1 / 60);
    }
  });

  return <context.Provider value={api}>{children}</context.Provider>;
}

export function useDie<PossibleValues extends number = number>({
  targetValue,
  position = [0, 0, 0],
  quaternion,
  rotation = [0, 0, 0],
  velocity = [0, 0, 0],
  angularVelocity = [0, 0, 0],
  shape,
  type,
}: {
  targetValue?: PossibleValues;
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  rotation?: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
  shape: Shape;
  type: string;
}) {
  const { world, precalculateDie } = React.useContext(context);
  const ref = React.useRef<Object3D>();
  const bodyRef = React.useRef<Body>();

  React.useLayoutEffect(() => {
    if (!ref.current) {
      ref.current = new Object3D();
    }

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
    body.velocity.set(velocity[0], velocity[1], velocity[2]);
    body.angularVelocity.set(
      angularVelocity[0],
      angularVelocity[1],
      angularVelocity[2],
    );
    body.addShape(shape);
    body.material = DieMaterial;
    body.sleepSpeedLimit = 1;

    bodyRef.current = body;
    world.addBody(body);

    if (targetValue) {
      precalculateDie({
        body,
        type,
        targetValue,
      });
    }

    return () => {
      bodyRef.current = undefined;
      world.removeBody(body);
    };
  }, []);

  useFrame(() => {
    if (ref.current && bodyRef.current) {
      ref.current.position.fromArray(bodyRef.current.position.toArray());
      ref.current.quaternion.fromArray(bodyRef.current.quaternion.toArray());
    }
  });

  return [ref];
}
