import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldPlayersResolver: Resolvers<Context> = {
  World: {
    players: async (world, __, { prisma }) => {
      return (
        await prisma.playerInWorld.findMany({
          where: { worldId: world.id },
          include: { player: true },
        })
      ).map(({ player, role }) => ({ ...player, role }));
    },
  },
};
