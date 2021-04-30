import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const SubscriptionNewMessagesResolver: Resolvers<Context> = {
  Subscription: {
    newMessages: {
      subscribe: (_, { worldId }, { pubsub }) =>
        pubsub.asyncIterator('createMessage', {
          filter: (message) => message.worldId === worldId,
          map: (message) => ({
            newMessages: [message],
          }),
        }),
    },
  },
};
