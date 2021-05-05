import { useAspect } from '@react-three/drei';
import * as React from 'react';
import { D10, D12, D20, D4, D6, D8 } from './';

const dieMap = {
  D4: D4,
  D6: D6,
  D8: D8,
  D10: D10,
  D12: D12,
  D20: D20,
};

type Roll = {
  id: string;
  roller: { color: string };
  dice: { type: string; value: number }[];
};

export function DiceBox({ rolls }: { rolls?: (Roll | null)[] }) {
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
          nextMap.set(roll?.id, roll);
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
          <>
            {roll.dice.map((die, idx) => {
              const Die = dieMap[die.type as keyof typeof dieMap];
              return (
                <Die
                  key={roll.id + idx}
                  targetValue={die.value as any}
                  position={position}
                />
              );
            })}
          </>
        );
      })}
    </>
  );
}
