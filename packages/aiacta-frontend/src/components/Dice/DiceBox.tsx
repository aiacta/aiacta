import { useAspect } from '@react-three/drei';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { AudioListener } from 'three';
import { useDiceRollsSubscription } from '../../api';
import { Die } from './Die';
import { Physics } from './Physics';

const debug = false;

type Roll = {
  id: string;
  roller: { color: string };
  dice: { type: string; value: number }[];
  dissolve?: boolean;
  dissolved?: number;
};

export const DiceBoxContext = React.createContext({
  audioListener: new AudioListener(),
});

export function DiceBox() {
  const { worldId } = useParams();

  const [rolls] = useDiceRollsSubscription({ variables: { worldId } });

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
      <ambientLight />
      <spotLight
        intensity={0.6}
        position={[0, 0, 60]}
        angle={2}
        penumbra={1}
        castShadow
      />
      <Physics gravity={debug ? 0 : undefined}>
        <React.Suspense fallback={null}>
          <Rolls rolls={rolls.data?.diceRolls} />
          {debug && <DebugDice />}
          {/* lands on 14 */}
          {/* <ExpectedTestRolls type="d20" offset={-9} rotation={[-10, 90, 0]} /> */}
          {/* <Die
            key={Math.random()}
            type="d20"
            position={[0, 0, 10]}
            rotation={[-10, 90, 0]}
          /> */}
        </React.Suspense>
      </Physics>
    </ThreeCanvas>
  );
}

function Rolls({ rolls }: { rolls?: (Roll | null)[] }) {
  const aspect = useAspect(
    100,
    (100 * window.innerHeight) / window.innerWidth,
    0.6,
  );

  const minX = -aspect[0] / 2;
  const minY = -aspect[1] / 2;
  const maxX = aspect[0] / 2;
  const maxY = aspect[1] / 2;

  const [currentRolls, setCurrentRolls] = React.useState(
    () => new Map<string, Roll>(),
  );
  React.useEffect(() => {
    setCurrentRolls((map) => {
      const nextMap = new Map(map);
      rolls?.forEach((roll) => {
        if (roll) {
          const id = roll.id;
          nextMap.set(id, roll);
          setTimeout(() => {
            setCurrentRolls((map) => {
              const nextMap = new Map(map);
              const roll = nextMap.get(id);
              if (roll) {
                roll.dissolve = true;
                roll.dissolved = 0;
              }
              return nextMap;
            });
          }, 10000);
        }
      });
      return nextMap;
    });
  }, [rolls]);

  return (
    <>
      {[...currentRolls.values()].map((roll) => {
        const verticalOrHorizontal =
          Math.sign(Math.random() - 0.5) < 0 ? 'vertical' : 'horizontal';
        const position = (verticalOrHorizontal === 'vertical'
          ? [
              Math.sign(Math.random() - 0.5) < 0 ? minX : maxX,
              minY + aspect[1] * Math.random(),
              10,
            ]
          : [
              minX + aspect[0] * Math.random(),
              Math.sign(Math.random() - 0.5) < 0 ? minY : maxY,
              10,
            ]) as [number, number, number];
        const velocity = [-position[0] * 2, -position[1] * 2, 0] as [
          number,
          number,
          number,
        ];

        return (
          <React.Fragment key={roll.id}>
            {roll.dice.map((die, idx) => {
              return (
                <Die
                  key={idx}
                  type={die.type.toLowerCase() as any}
                  targetValue={die.value}
                  position={position}
                  velocity={velocity}
                  angularVelocity={[
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                    Math.random() * 50 - 25,
                  ]}
                  dissolve={roll.dissolve}
                  onDissolved={() => {
                    setCurrentRolls((map) => {
                      const actualRoll = map.get(roll!.id);
                      if (
                        actualRoll &&
                        typeof actualRoll.dissolved === 'number'
                      ) {
                        ++actualRoll.dissolved;
                        if (actualRoll.dissolved >= actualRoll.dice.length) {
                          const nextMap = new Map(map);
                          nextMap.delete(actualRoll.id);
                          return nextMap;
                        }
                      }
                      return map;
                    });
                  }}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}

function DebugDice() {
  return (
    <>
      <DebugDiceGroup type="d4" offset={-10} />
      <DebugDiceGroup type="d6" offset={-6} />
      <DebugDiceGroup type="d8" offset={-2} />
      <DebugDiceGroup type="d10" offset={2} />
      <DebugDiceGroup type="d12" offset={6} />
      <DebugDiceGroup type="d20" offset={10} />
    </>
  );
}

function DebugDiceGroup({ offset, type }: { offset: number; type: any }) {
  return (
    <>
      <Die
        key={Math.random().toString()}
        type={type}
        position={[-10, offset, 10]}
        angularVelocity={[0, 0, 0]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[-5, offset, 10]}
        angularVelocity={[-5, 0, 0]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[0, offset, 10]}
        angularVelocity={[0, -5, 0]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[5, offset, 10]}
        angularVelocity={[0, 0, -5]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[10, offset, 10]}
        angularVelocity={[4, 3, 2]}
      />
    </>
  );
}

function ExpectedTestRolls({
  rotation,
  type,
  offset,
}: {
  rotation?: [number, number, number];
  type: any;
  offset: number;
}) {
  return (
    <>
      {Array.from({ length: +type.slice(1) }, (_, i) => (
        <Die
          key={Math.random()}
          type={type}
          position={[-10 + 2 * i, offset, 10]}
          rotation={rotation}
          targetValue={i + 1}
        />
      ))}
    </>
  );
}

function DebugFour() {
  return (
    <>
      {/* lands on 1 */}
      <ExpectedTestRolls type="d4" offset={-5} rotation={[0, 120, 30]} />
      {/* lands on 2 */}
      <ExpectedTestRolls type="d4" offset={0} rotation={[20, 0, 0]} />
      {/* lands on 4 */}
      <ExpectedTestRolls type="d4" offset={-10} rotation={[0, 0, 0]} />
      {/* lands on 3 */}
      <ExpectedTestRolls type="d4" offset={5} rotation={[0, 30, 0]} />
    </>
  );
}

function DebugSix() {
  return (
    <>
      {/* lands on 1 */}
      <ExpectedTestRolls type="d6" offset={-10} rotation={[180, 0, 0]} />
      {/* lands on 2 */}
      <ExpectedTestRolls type="d6" offset={-7} rotation={[90, 0, 0]} />
      {/* lands on 3 */}
      <ExpectedTestRolls type="d6" offset={-4} rotation={[0, 90, 0]} />
      {/* lands on 4 */}
      <ExpectedTestRolls type="d6" offset={-1} rotation={[0, 270, 0]} />
      {/* lands on 5 */}
      <ExpectedTestRolls type="d6" offset={2} rotation={[270, 0, 0]} />
      {/* lands on 6 */}
      <ExpectedTestRolls type="d6" offset={5} />
    </>
  );
}

function DebugEight() {
  return (
    <>
      {/* lands on 5 */}
      <ExpectedTestRolls type="d8" offset={-10} rotation={[45, 45, 0]} />
      {/* lands on 2 */}
      <ExpectedTestRolls type="d8" offset={-5} rotation={[45, 45, 45]} />
      {/* lands on 7 */}
      <ExpectedTestRolls type="d8" offset={-3} rotation={[45, 45, 90]} />
      {/* lands on 8 */}
      <ExpectedTestRolls type="d8" offset={0} rotation={[45, 145, 90]} />
    </>
  );
}

function DebugTen() {
  return (
    <>
      {/* lands on 2 */}
      <ExpectedTestRolls type="d10" offset={-10} rotation={[45, 145, 90]} />
      {/* lands on 8 */}
      <ExpectedTestRolls type="d10" offset={-6} rotation={[45, 145, 0]} />
      {/* lands on 5 */}
      <ExpectedTestRolls type="d10" offset={-3} rotation={[45, 0, 0]} />
      {/* lands on 7 */}
      <ExpectedTestRolls type="d10" offset={0} rotation={[-10, 0, 0]} />
    </>
  );
}

function DebugTwelve() {
  return (
    <>
      {/* lands on 11 */}
      <ExpectedTestRolls type="d12" offset={-9} rotation={[-10, 0, 0]} />
      {/* lands on 1 */}
      <ExpectedTestRolls type="d12" offset={-5} rotation={[-10, 90, 0]} />
    </>
  );
}
