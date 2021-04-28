import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const SubscriptionNewMessagesResolver: Resolvers<Context> = {
  Subscription: {
    newMessages: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator('createMessage', (message) => ({
          newMessages: [message],
        })),
    },
  },
};
