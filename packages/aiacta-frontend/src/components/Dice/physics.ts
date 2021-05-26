import * as React from 'react';
import { Mesh, Vector3 } from 'three';
import { isTruthy } from '../../util';
import PhysicsWorker from './physics.worker?worker';

const Physics = new PhysicsWorker();
const PhysicsContext =
  React.createContext<{
    setDie(
      id: string,
      opts: {
        mesh: Mesh;
        onCollision: (info: {
          body: { velocity: Vector3 };
          target: { velocity: Vector3 };
          contact: { restitution: number };
        }) => void;
      },
    ): void;
    addDice(
      dice: {
        id: string;
        type: string;
        position: [number, number, number];
        quaternion: [number, number, number, number];
        velocity: [number, number, number];
        angularVelocity: [number, number, number];
      }[],
    ): Promise<{ rolledValue: number; iteration: number }[]>;
    removeDie(props: { id: string }): void;
  } | null>(null);

const maxConcurrentDice = 100;

export function usePhysics({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [api] = React.useState(() => {
    const bodies = Array.from(
      { length: maxConcurrentDice },
      () => null as null | string,
    );
    const meta = new Map<
      string,
      {
        mesh: Mesh;
        onCollision: (info: {
          body: { velocity: Vector3 };
          target: { velocity: Vector3 };
          contact: { restitution: number };
        }) => void;
        onWakeUp: () => void;
        onRest: () => void;
      }
    >();
    let positions = new Float32Array(maxConcurrentDice * 3);
    let quaternions = new Float32Array(maxConcurrentDice * 4);

    const waitingDice = new Map<
      string,
      (r: { rolledValue: number; iteration: number }) => void
    >();

    function physicsLoop() {
      if (positions.byteLength !== 0 && quaternions.byteLength !== 0) {
        Physics.postMessage({ op: 'step', positions, quaternions }, [
          positions.buffer,
          quaternions.buffer,
        ]);
      }
      requestAnimationFrame(physicsLoop);
    }

    Physics.addEventListener('message', (msg) => {
      const { op, ...data } = msg.data;
      switch (op) {
        case 'frame': {
          positions = data.positions;
          quaternions = data.quaternions;
          for (const [key, value] of meta) {
            const idx = bodies.indexOf(key);
            value.mesh.position.set(
              positions[idx * 3 + 0],
              positions[idx * 3 + 1],
              positions[idx * 3 + 2],
            );
            value.mesh.quaternion.set(
              quaternions[idx * 4 + 0],
              quaternions[idx * 4 + 1],
              quaternions[idx * 4 + 2],
              quaternions[idx * 4 + 3],
            );
          }
          break;
        }
        case 'collision': {
          const { id, body, target, contact } = data as {
            id: string;
            body: { velocity: [number, number, number] };
            target: { velocity: [number, number, number] };
            contact: { restitution: number };
          };
          meta.get(id)?.onCollision({
            body: { velocity: new Vector3(...body.velocity) },
            target: { velocity: new Vector3(...target.velocity) },
            contact,
          });
          break;
        }
        case 'wakeup': {
          const { id } = data as { id: string };
          meta.get(id)?.onWakeUp();
          break;
        }
        case 'sleep': {
          const { id } = data as { id: string };
          meta.get(id)?.onRest();
          break;
        }
        case 'roll': {
          const { results, iteration } = data as {
            results: { id: string; rolledValue: number }[];
            iteration: number;
          };
          results.forEach((die) => {
            waitingDice.get(die.id)?.({
              rolledValue: die.rolledValue,
              iteration,
            });
          });
          break;
        }
      }
    });

    requestAnimationFrame(physicsLoop);

    return {
      init(width: number, height: number) {
        Physics.postMessage({
          op: 'init',
          width,
          height,
        });
      },
      async addDice(
        dice: {
          id: string;
          type: string;
          position: [number, number, number];
          quaternion: [number, number, number, number];
          velocity: [number, number, number];
          angularVelocity: [number, number, number];
        }[],
      ) {
        const diceToAdd = dice
          .map((die) => {
            const idx = bodies.findIndex((b) => !b);

            if (idx === -1) {
              return null;
            }

            bodies[idx] = die.id;

            return {
              id: die.id,
              type: die.type,
              idx,
              position: die.position,
              quaternion: die.quaternion,
              velocity: die.velocity,
              angularVelocity: die.angularVelocity,
            };
          })
          .filter(isTruthy);

        Physics.postMessage({
          op: 'addDice',
          dice: diceToAdd,
        });

        return Promise.all(
          diceToAdd.map(
            (die) =>
              new Promise<{ rolledValue: number; iteration: number }>(
                (resolve) => {
                  waitingDice.set(die.id, resolve);
                },
              ),
          ),
        );
      },
      removeDie(props: { id: string }) {
        Physics.postMessage({
          op: 'removeDie',
          id: props.id,
        });
        bodies[bodies.indexOf(props.id)] = null;
        meta.delete(props.id);
      },
      setDie(
        id: string,
        opts: {
          mesh: Mesh;
          onCollision: (info: {
            body: { velocity: Vector3 };
            target: { velocity: Vector3 };
            contact: { restitution: number };
          }) => void;
          onWakeUp: () => void;
          onRest: () => void;
        },
      ) {
        meta.set(id, opts);
      },
    };
  });

  React.useEffect(() => {
    api.init(width, height);
  }, [width, height]);

  return api;
}

export const PhysicsProvider = PhysicsContext.Provider;

export function usePhysicsApi() {
  const api = React.useContext(PhysicsContext);

  if (!api) {
    throw new Error('Not inside a PhysicsContext!');
  }

  return api;
}

export function usePhysicsForDie(
  id: string,
  opts: {
    mesh: React.MutableRefObject<Mesh | undefined>;
    onCollision: (info: {
      body: { velocity: Vector3 };
      target: { velocity: Vector3 };
      contact: { restitution: number };
    }) => void;
    onWakeUp: () => void;
    onRest: () => void;
  },
) {
  const api = usePhysicsApi();

  React.useEffect(() => {
    if (opts.mesh.current) {
      api.setDie(id, {
        ...opts,
        mesh: opts.mesh.current,
      });
    }
  }, [id]);
}
