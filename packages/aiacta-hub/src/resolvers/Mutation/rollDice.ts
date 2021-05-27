import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { v4 as uuid } from 'uuid';
import { Context } from '../../context';
import { rollDice } from '../../functions';

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

      const { result, rolledDice } = await rollDice(input.formula, context);

      const diceRoll = {
        worldId,
        id: uuid(),
        roller: { ...playerInWorld.player, role: playerInWorld.role },
        dice: rolledDice,
        message: result.toChatMessage(true),
      };

      pubsub.publish('rollDice', diceRoll);

      return diceRoll;
    },
  },
};
