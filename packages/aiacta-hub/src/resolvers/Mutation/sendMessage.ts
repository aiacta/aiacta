import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const MutationSendMessageResolver: Resolvers<Context> = {
  Mutation: {
    sendMessage: async (
      _,
      { worldId, input: { component, text } },
      { playerId, prisma, pubsub },
    ) => {
      if (!playerId) {
        throw new ForbiddenError('Cannot write message');
      }

      const message = await prisma.chatMessage.create({
        data: {
          world: { connect: { id: worldId } },
          author: { connect: { id: playerId } },
          component,
          text,
        },
        include: {
          author: true,
        },
      });

      pubsub.publish('createMessage', message);

      return message;
    },
  },
};
