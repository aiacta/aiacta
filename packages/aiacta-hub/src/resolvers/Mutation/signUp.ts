import { Resolvers } from '@aiacta/graphql';
import { hashSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Context } from '../../context';

export const MutationSignUpResolver: Resolvers<Context> = {
  Mutation: {
    signUp: async (_, { name, password }, { prisma }) => {
      let player = await prisma.player.findUnique({ where: { name } });
      if (player) {
        throw new Error('Player already exists');
      }

      player = await prisma.player.create({
        data: { name, password: hashSync(password) },
      });

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
