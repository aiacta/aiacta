import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const QueryWorldsResolver: Resolvers<Context> = {
  Query: {
    worlds: (_, __, { prisma, playerId }) =>
      playerId
        ? prisma.world
            .findMany({
              include: {
                messages: true,
                players: { include: { player: true } },
              },
              where: { players: { some: { playerId } } },
            })
            .then((worlds) =>
              worlds.map((world) => ({
                ...world,
                players: world.players.map(({ player, role }) => ({
                  ...player,
                  role: role as any,
                })),
              })),
            )
        : null,
  },
};
