import { useAspect } from '@react-three/drei';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDiceRollsSubscription } from '../../api';
import { Die } from './Die';
import { Physics } from './Physics';

type Roll = {
  id: string;
  roller: { color: string };
  dice: { type: string; value: number }[];
  dissolve?: boolean;
  dissolved?: number;
};

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
      <Physics>
        <React.Suspense fallback={null}>
          <Rolls rolls={rolls.data?.diceRolls} />
        </React.Suspense>
      </Physics>
    </ThreeCanvas>
  );
}

function Rolls({ rolls }: { rolls?: (Roll | null)[] }) {
  const aspect = useAspect(
    100,
    (100 * window.innerHeight) / window.innerWidth,
    0.8,
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

        return (
          <React.Fragment key={roll.id}>
            {roll.dice.map((die, idx) => {
              return (
                <Die
                  key={idx}
                  type={die.type.toLowerCase() as any}
                  targetValue={die.value}
                  position={position}
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
