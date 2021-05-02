import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldMessagesResolver: Resolvers<Context> = {
  World: {
    messages: async (world, __, { prisma }) => {
      return prisma.chatMessage.findMany({
        where: { worldId: world.id },
        orderBy: { id: 'desc' },
        take: 10,
        include: { author: true },
      });
    },
  },
};
