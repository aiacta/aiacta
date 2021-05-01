import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { Role } from '@aiacta/prisma';
import { hashSync } from 'bcryptjs';
import { Context } from '../../context';

export const MutationCreateWorldResolver: Resolvers<Context> = {
  Mutation: {
    createWorld: async (
      _,
      { input: { name, inviteOnly, password } },
      { prisma, playerId },
    ) => {
      if (!playerId) {
        throw new ForbiddenError('Cannot create world');
      }

      const { world } = await prisma.playerInWorld.create({
        data: {
          world: {
            create: {
              name,
              inviteOnly,
              password: password ? hashSync(password) : null,
              creator: { connect: { id: playerId } },
            },
          },
          player: {
            connect: { id: playerId },
          },
          role: Role.GAMEMASTER,
        },
        include: {
          world: {
            include: { creator: true, players: { include: { player: true } } },
          },
        },
      });

      return {
        ...world,
        players: world.players.map(({ player, role }) => ({
          ...player,
          role: role as any,
        })),
      };
    },
  },
};
