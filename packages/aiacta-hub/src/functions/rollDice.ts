import { Program } from '@aiacta/dicelang';
import { DieType } from '@aiacta/graphql/src/resolvers';
import { v4 as uuid } from 'uuid';

export async function rollDice(formula: string, context: any) {
  const rolledDice: { id: string; type: DieType; value: number }[] = [];
  const result = await new Program(formula).run(
    {
      async roll(faces) {
        const value = Math.round(Math.random() * (faces - 1)) + 1;
        rolledDice.push({
          id: uuid(),
          type: ('D' + faces) as DieType,
          value,
        });
        return value;
      },
    },
    context,
  );
  return { result, rolledDice };
}
