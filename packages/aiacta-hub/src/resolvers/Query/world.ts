import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const QueryWorldResolver: Resolvers<Context> = {
  Query: {
    world: (_, { id }, { prisma, playerId }) =>
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
          if (!world?.players.some((p) => p.playerId === playerId)) {
            throw new ForbiddenError('Cannot access world');
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
