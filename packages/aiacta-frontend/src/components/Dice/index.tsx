import { useQueue } from '@mantine/hooks';
import { useAspect } from '@react-three/drei';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Mesh, Vector3 } from 'three';
import { useDiceRollsSubscription } from '../../api';
import { isTruthy } from '../../util';
import { Die } from './Die';
import PhysicsWorker from './physics.tsx?worker';

const maxConcurrentRolls = 10;
const maxConcurrentDice = 100;

export const Physics = (() => {
  const Physics = new PhysicsWorker();

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
          console.log(`${die.id} rolled ${die.rolledValue}`);
        });
        break;
      }
    }
  });

  requestAnimationFrame(physicsLoop);

  return {
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
      },
    ) {
      meta.set(id, opts);
    },
    setSize(width: number, height: number) {
      Physics.postMessage({
        op: 'init',
        width,
        height,
      });
    },
  };
})();

export function DiceBox() {
  const { rolls, removeRoll } = useDiceRolls();

  return (
    <ThreeCanvas
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0,
        pointerEvents: 'none',
      }}
      camera={{
        position: [0, 0, 80],
        fov: 20,
      }}
    >
      <SetupPhysics />
      <React.Suspense fallback={null}>
        {rolls.map((roll) => (
          <Roll key={roll.id} roll={roll} onRemove={() => removeRoll(roll)} />
        ))}
      </React.Suspense>
    </ThreeCanvas>
  );
}

function SetupPhysics() {
  const aspect = useAspect(
    100,
    (100 * window.innerHeight) / window.innerWidth,
    0.8,
  );
  React.useEffect(() => {
    Physics.setSize(aspect[0], aspect[1]);
  }, [aspect[0], aspect[1]]);

  return null;
}

function useDiceRolls() {
  const { worldId } = useParams();

  const currentRolls = useQueue<{
    id: string;
    dice: {
      id: string;
      type: string;
      targetValue: number;
      rolledValue: number;
      iteration: number;
    }[];
  }>({
    limit: maxConcurrentRolls,
  });

  const [rolls] = useDiceRollsSubscription({ variables: { worldId } });
  React.useEffect(() => {
    if (rolls.data?.diceRolls) {
      Promise.all(
        rolls.data.diceRolls.filter(isTruthy).map(async (roll) => {
          const results = await Physics.addDice(
            roll.dice.map((die) => ({
              ...die,
              type: die.type.toLowerCase(),
              position: [0, 0, 10],
              quaternion: [
                Math.random(),
                Math.random(),
                Math.random(),
                Math.random(),
              ],
              velocity: [0, 0, 0],
              angularVelocity: [
                (0.7 + Math.random() * 0.3) *
                  20 *
                  (Math.random() < 0.5 ? 1 : -1),
                (0.7 + Math.random() * 0.3) *
                  20 *
                  (Math.random() < 0.5 ? 1 : -1),
                (0.7 + Math.random() * 0.3) *
                  20 *
                  (Math.random() < 0.5 ? 1 : -1),
              ],
            })),
          );
          currentRolls.add({
            ...roll,
            dice: roll.dice.slice(0, results.length).map((die, idx) => ({
              ...die,
              type: die.type.toLowerCase(),
              rolledValue: results[idx].rolledValue,
              targetValue: die.value,
              iteration: results[idx].iteration,
            })),
          });
        }),
      );
    }
  }, [rolls.data?.diceRolls]);

  return {
    rolls: currentRolls.state,
    removeRoll: (roll: { id: string }) =>
      currentRolls.update((state) => state.filter((s) => s.id !== roll.id)),
  };
}

function Roll({
  roll,
  onRemove,
}: {
  roll: {
    id: string;
    dice: {
      id: string;
      type: string;
      targetValue: number;
      rolledValue: number;
      iteration: number;
    }[];
  };
  onRemove: () => void;
}) {
  const dissolved = React.useRef(0);

  return (
    <React.Fragment>
      {roll.dice.map((die) => (
        <Die
          key={die.id}
          id={die.id}
          type={die.type as any}
          onDissolved={() => {
            ++dissolved.current >= roll.dice.length && onRemove();
            Physics.removeDie(die);
          }}
          targetValue={die.targetValue}
          rolledValue={die.rolledValue}
          iteration={die.iteration}
        />
      ))}
    </React.Fragment>
  );
}
