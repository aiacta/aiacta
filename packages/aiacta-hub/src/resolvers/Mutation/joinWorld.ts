import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { Role } from '@aiacta/prisma';
import { compare } from 'bcryptjs';
import { Context } from '../../context';

export const MutationJoinWorldResolver: Resolvers<Context> = {
  Mutation: {
    joinWorld: async (
      _,
      { worldId, joinKey, password },
      { prisma, playerId },
    ) => {
      if (!playerId) {
        throw new ForbiddenError('Cannot join world');
      }

      const world = await prisma.world.findUnique({
        where: { id: worldId },
        include: { playersInvited: true },
      });
      if (!world) {
        throw new Error('World does not exist');
      }

      if (world.playersInvited.some((player) => player.id === playerId)) {
        return world;
      }

      if (world.inviteOnly) {
        const playerWasInvited = world.playersInvited.some(
          (player) => player.id === playerId,
        );
        if (!playerWasInvited) {
          throw new ForbiddenError('You cannot join this world');
        }
      } else if (world.password) {
        if (joinKey && world.joinKey !== joinKey) {
          throw new ForbiddenError('Invalid join-link');
        } else {
          const passwordIsValid = await compare(password ?? '', world.password);
          if (!passwordIsValid) {
            throw new ForbiddenError('Invalid password');
          }
        }
      }

      await prisma.playerInWorld.create({
        data: {
          player: { connect: { id: playerId } },
          world: { connect: { id: worldId } },
          role: Role.GAMEMASTER,
        },
      });

      return world;
    },
  },
};
