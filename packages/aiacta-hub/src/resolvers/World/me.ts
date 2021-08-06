import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldMeResolver: Resolvers<Context> = {
  World: {
    me: async ({ id }, __, { prisma, playerId }) => {
      if (!playerId) {
        return null;
      }
      const playerInWorld = await prisma.playerInWorld.findUnique({
        where: { playerId_worldId: { worldId: id, playerId } },
        include: { player: true },
      });
      return (
        playerInWorld && { ...playerInWorld.player, role: playerInWorld.role }
      );
    },
  },
};
