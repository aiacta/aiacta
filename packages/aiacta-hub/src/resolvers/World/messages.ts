import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldMessagesResolver: Resolvers<Context> = {
  World: {
    messages: async (world, __, { prisma, playerId }) => {
      const worldDetailed = await prisma.world.findUnique({
        where: { id: world.id },
        include: { players: true },
      });
      if (!worldDetailed?.players.some((p) => p.playerId === playerId)) {
        throw new ForbiddenError('Cannot access world');
      }

      return prisma.chatMessage.findMany({
        where: { worldId: world.id },
        orderBy: { id: 'desc' },
        take: 10,
        include: { author: true },
      });
    },
  },
};
