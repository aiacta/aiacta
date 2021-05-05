import { Program } from '@aiacta/dicelang';
import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { DieType } from '@aiacta/graphql/src/resolvers';
import { v4 as uuid } from 'uuid';
import { Context } from '../../context';

export const MutationRollDiceResolver: Resolvers<Context> = {
  Mutation: {
    rollDice: async (_, { worldId, input }, { pubsub, prisma, playerId }) => {
      if (!playerId) {
        throw new ForbiddenError('Not logged in or invalid token');
      }

      const playerInWorld = await prisma.playerInWorld.findUnique({
        where: { playerId_worldId: { playerId, worldId } },
        include: { player: true },
      });

      if (!playerInWorld) {
        throw new ForbiddenError('Not logged in or invalid token');
      }

      const context = {}; // get from input def

      const rolledDice: { id: string; type: DieType; value: number }[] = [];
      const result = await new Program(input.formula).run(
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

      const diceRoll = {
        worldId,
        id: uuid(),
        roller: { ...playerInWorld.player, role: playerInWorld.role },
        dice: rolledDice,
        message: result.toChatMessage(),
      };

      pubsub.publish('rollDice', diceRoll);

      return diceRoll;
    },
  },
};
