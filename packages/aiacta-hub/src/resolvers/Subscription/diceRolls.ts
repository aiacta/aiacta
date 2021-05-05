import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const SubscriptionDiceRollsResolver: Resolvers<Context> = {
  Subscription: {
    diceRolls: {
      subscribe: (_, { worldId }, { pubsub }) =>
        pubsub.asyncIterator('rollDice', {
          filter: (diceRoll) => diceRoll.worldId === worldId,
          map: (diceRoll) => ({
            diceRolls: [diceRoll],
          }),
        }),
    },
  },
};
