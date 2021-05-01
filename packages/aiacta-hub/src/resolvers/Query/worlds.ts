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
                creator: { ...world.creator, role: Role.GAMEMASTER },
                players: world.players.map(({ player, role }) => ({
                  ...player,
                  role,
                })),
              })),
            )
        : null,
  },
};
