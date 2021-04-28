import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const MutationSendMessageResolver: Resolvers<Context> = {
  Mutation: {
    sendMessage: async (
      _,
      { worldId, input: { component, text } },
      { prisma, pubsub },
    ) => {
      const message = await prisma.chatMessage.create({
        data: { worldId, component, text },
      });

      pubsub.publish('createMessage', message);

      return message;
    },
  },
};
