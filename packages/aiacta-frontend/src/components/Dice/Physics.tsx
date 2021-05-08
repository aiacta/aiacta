import { useAspect } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Body, Shape, World } from 'cannon-es';
import { ContactEquation } from 'equations/ContactEquation';
import * as React from 'react';
import { Object3D } from 'three';
import {
  calculateQuaternionForResult,
  calculateResults,
} from './diceCalculation';
import { createWorld, DieMaterial } from './world';

type CalculationOptions = {
  body: Body;
  type: string;
  targetValue: number;
  onCalculated: () => void;
};

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

  const precalculationDice = React.useRef<CalculationOptions[]>();
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
                console.log(
                  `die landed on ${
                    results.get(die)!.value
                  }, need to be ${targetValue}`,
                );
                const rotationQuaternion = calculateQuaternionForResult(
                  body,
                  results.get(die)!.value,
                  targetValue,
                );
                if (rotationQuaternion) {
                  body.quaternion = rotationQuaternion;
                }
              }
              die.onCalculated();
            });
            precalculationDice.current = undefined;
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
  onCollision,
}: {
  targetValue?: PossibleValues;
  position?: [number, number, number];
  quaternion?: [number, number, number, number];
  rotation?: [number, number, number];
  velocity?: [number, number, number];
  angularVelocity?: [number, number, number];
  shape: Shape;
  type: string;
  onCollision: (info: {
    body: Body;
    target: Body;
    contact: ContactEquation;
  }) => void;
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
        onCalculated: () => {
          body.addEventListener('collide', (event: any) => {
            onCollision(event);
          });
        },
      });
    } else {
      body.addEventListener('collide', (event: any) => {
        onCollision(event);
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
