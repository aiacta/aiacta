import { Resolvers } from '@aiacta/graphql';
import { Role } from '@aiacta/graphql/src/resolvers';
import { Context } from '../../context';

export const QueryWorldsResolver: Resolvers<Context> = {
  Query: {
    worlds: (_, __, { prisma, playerId }) =>
      playerId
        ? prisma.world
            .findMany({
              include: {
                // messages: true,
                creator: true,
                players: { include: { player: true } },
              },
              where: {
                OR: [
                  { players: { some: { playerId } } },
                  { playersInvited: { some: { id: playerId } } },
                  { inviteOnly: false },
                ],
              },
            })
            .then((worlds) =>
              worlds.map((world) => ({
                ...world,
                creator: { ...world.creator, role: Role.Gamemaster },
                players: world.players.map(({ player, role }) => ({
                  ...player,
                  role: role as any,
                })),
              })),
            )
        : null,
  },
};
