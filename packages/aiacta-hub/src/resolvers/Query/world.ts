import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const QueryWorldResolver: Resolvers<Context> = {
  Query: {
    world: (_, { id }, { prisma }) =>
      prisma.world
        .findUnique({
          where: { id },
          include: {
            players: { include: { player: true } },
          },
        })
        .then((world) => {
          if (!world) {
            return null;
          }
          return {
            ...world,
            players: world.players.map(({ player, role }) => ({
              ...player,
              role,
            })),
          };
        }),
  },
};
