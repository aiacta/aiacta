import { Resolvers } from '@aiacta/graphql';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Context } from '../../context';

export const MutationLoginResolver: Resolvers<Context> = {
  Mutation: {
    login: async (_, { name, password }, { prisma }) => {
      const player = await prisma.player.findUnique({ where: { name } });
      if (!player) {
        throw new Error('Invalid player or password');
      }

      const valid = await compare(password, player.password);
      if (!valid) {
        throw new Error('Invalid player or password');
      }

      const token = sign(
        { playerId: player.id },
        process.env.JWT_SECRET ?? 'aiacta',
      );

      return {
        token,
        refreshToken: 'not-implemented',
        player,
      };
    },
  },
};
