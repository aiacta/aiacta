import { useQueue } from '@mantine/hooks';
import { Plane, useAspect, useContextBridge } from '@react-three/drei';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDiceRollsSubscription } from '../../api';
import { isTruthy, zIndices } from '../../util';
import { Die } from './Die';
import { PhysicsProvider, usePhysics, usePhysicsApi } from './physics';

const maxConcurrentRolls = 10;
const debug = false;

const RollContext =
  React.createContext<{
    shouldAwait: (date: string) => boolean;
    hasRolled: (id: string) => boolean;
    awaitRoll: (id: string) => Promise<void>;
    finishRoll: (id: string) => void;
  } | null>(null);

export function RollProvider({ children }: { children: React.ReactNode }) {
  const [api] = React.useState(() => {
    const waitingPromises = new Map<string, Promise<void>>();
    const deferredRolls = new Map<string, () => void>();
    const finishedRolls = new Set<string>();
    const listeningSince = Date.now();

    return {
      shouldAwait(date: string) {
        return new Date(date).getTime() >= listeningSince;
      },
      hasRolled(id: string) {
        return finishedRolls.has(id);
      },
      awaitRoll(id: string) {
        if (finishedRolls.has(id)) {
          return Promise.resolve();
        }
        if (!waitingPromises.has(id)) {
          waitingPromises.set(
            id,
            new Promise<void>((resolve) => deferredRolls.set(id, resolve)),
          );
        }
        return waitingPromises.get(id)!;
      },
      finishRoll(id: string) {
        deferredRolls.get(id)?.();
        finishedRolls.add(id);
      },
    };
  });

  return <RollContext.Provider value={api}>{children}</RollContext.Provider>;
}

export function useRollStatus(id: string, date: string) {
  return useRollsStatus([id], date);
}

export function useRollsStatus(ids: string[], date: string) {
  const api = React.useContext(RollContext);

  if (!api) {
    throw new Error('Not inside a RollContext');
  }

  const [status, setStatus] = React.useState<'rolling' | 'rolled'>(
    ids.length > 0 && api.shouldAwait(date) ? 'rolling' : 'rolled',
  );

  React.useEffect(() => {
    let isMounted = true;

    Promise.all(ids.map((id) => api.awaitRoll(id))).then(() => {
      if (isMounted) {
        setStatus('rolled');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [ids.join(',')]);

  return {
    isRolling: status === 'rolling',
    isRolled: status === 'rolled',
    status,
  };
}

export function DiceBox() {
  const { worldId } = useParams();
  const [rolls] = useDiceRollsSubscription({ variables: { worldId } });
  const ContextBridge = useContextBridge(RollContext);

  return (
    <ThreeCanvas
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: zIndices.Dice,
      }}
      camera={{
        position: [0, 0, 80],
        fov: 20,
      }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={0.5}
        position={[6, 6, 10]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-top={-100}
        shadow-camera-bottom={100}
        shadow-camera-left={-100}
        shadow-camera-right={100}
      />
      <ContextBridge>
        <Physics>
          <Rolls rolls={rolls.data?.diceRolls.filter(isTruthy)} />
          <Plane receiveShadow args={[100, 100]}>
            <shadowMaterial attach="material" />
          </Plane>
        </Physics>
      </ContextBridge>
    </ThreeCanvas>
  );
}

function Rolls({
  rolls: rollData,
}: {
  rolls?: { id: string; dice: { id: string; type: string; value: number }[] }[];
}) {
  const { rolls, removeRoll } = useDiceRolls(rollData);

  const rollsContext = React.useContext(RollContext);

  if (!rollsContext) {
    throw new Error('Not inside a RollContext');
  }

  return (
    <React.Suspense fallback={null}>
      {rolls.map((roll) => (
        <Roll
          key={roll.id}
          roll={roll}
          onRemove={() => removeRoll(roll)}
          onRest={() => rollsContext.finishRoll(roll.id)}
        />
      ))}
      {debug && <DebugRolls />}
    </React.Suspense>
  );
}

function Physics({ children }: { children: React.ReactNode }) {
  const aspect = useAspect(
    100,
    (100 * window.innerHeight) / window.innerWidth,
    0.8,
  );

  const api = usePhysics({ width: aspect[0], height: aspect[1] });

  return <PhysicsProvider value={api}>{children}</PhysicsProvider>;
}

function useDiceRolls(
  rolls?: { id: string; dice: { id: string; type: string; value: number }[] }[],
) {
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

  const aspect = useAspect(
    100,
    (100 * window.innerHeight) / window.innerWidth,
    0.6,
  );

  const minX = -aspect[0] / 2;
  const minY = -aspect[1] / 2;
  const maxX = aspect[0] / 2;
  const maxY = aspect[1] / 2;

  const api = usePhysicsApi();

  const rollsApi = React.useContext(RollContext);

  if (!rollsApi) {
    throw new Error('Not inside a RollContext');
  }

  React.useEffect(() => {
    if (rolls) {
      Promise.all(
        rolls
          .filter(isTruthy)
          .filter((roll) => !rollsApi.hasRolled(roll.id))
          .map(async (roll) => {
            const verticalOrHorizontal =
              Math.sign(Math.random() - 0.5) < 0 ? 'vertical' : 'horizontal';
            const position = (
              verticalOrHorizontal === 'vertical'
                ? [
                    Math.sign(Math.random() - 0.5) < 0 ? minX : maxX,
                    minY + aspect[1] * Math.random(),
                    30,
                  ]
                : [
                    minX + aspect[0] * Math.random(),
                    Math.sign(Math.random() - 0.5) < 0 ? minY : maxY,
                    30,
                  ]
            ) as [number, number, number];
            const velocity = [-position[0] * 5, -position[1] * 5, 0] as [
              number,
              number,
              number,
            ];

            const results = await api.addDice(
              roll.dice.map((die) => ({
                ...die,
                type: die.type.toLowerCase(),
                position,
                quaternion: [
                  Math.random(),
                  Math.random(),
                  Math.random(),
                  Math.random(),
                ],
                velocity,
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
  }, [rolls]);

  return {
    rolls: currentRolls.state,
    removeRoll: (roll: { id: string }) =>
      currentRolls.update((state) => state.filter((s) => s.id !== roll.id)),
  };
}

function Roll({
  roll,
  onRemove,
  onRest,
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
  onRest: () => void;
}) {
  const dissolved = React.useRef(0);
  const resting = React.useRef(0);

  const api = usePhysicsApi();

  return (
    <React.Fragment>
      {roll.dice.map((die) => (
        <Die
          key={die.id}
          id={die.id}
          type={die.type as any}
          onDissolved={() => {
            ++dissolved.current >= roll.dice.length && onRemove();
            api.removeDie(die);
          }}
          onWakeUp={() => {
            --resting.current;
          }}
          onRest={() => {
            ++resting.current >= roll.dice.length && onRest();
          }}
          targetValue={die.targetValue}
          rolledValue={die.rolledValue}
          iteration={die.iteration}
        />
      ))}
    </React.Fragment>
  );
}

function DebugRolls() {
  const [rolls, setRolls] = React.useState([] as any[]);

  const api = usePhysicsApi();

  React.useEffect(() => {
    const demoDice = [
      {
        id: 'test-d4.0' + Math.random(),
        position: [0, 0, 10],
        velocity: [0, 0, 0],
        angularVelocity: [10, 10, 0],
        quaternion: [1, 0, 0, 0],
        type: 'd4',
      },
      {
        id: 'test-d4.1' + Math.random(),
        position: [0, 0, 10],
        velocity: [0, 0, 0],
        angularVelocity: [10, 10, 0],
        quaternion: [1, 0, 0, 0],
        type: 'd4',
      },
      {
        id: 'test-d4.2' + Math.random(),
        position: [0, 0, 10],
        velocity: [0, 0, 0],
        angularVelocity: [10, 10, 0],
        quaternion: [1, 0, 0, 0],
        type: 'd4',
      },
    ] as any[];

    api.addDice(demoDice).then((result) => {
      setRolls([
        {
          id: 'test' + Math.random(),
          dice: demoDice.map((die, idx) => ({
            ...die,
            targetValue: 1,
            rolledValue: result[idx].rolledValue,
            iteration: 10000,
          })),
        },
      ]);
    });
  }, []);

  return (
    <>
      {rolls.map((roll) => (
        <Roll
          key={roll.id}
          roll={roll}
          onRemove={() => {
            //
          }}
          onRest={() => {
            //
          }}
        />
      ))}
    </>
  );
}
