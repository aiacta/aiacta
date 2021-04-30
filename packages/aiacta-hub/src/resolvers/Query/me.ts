import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const QueryMeResolver: Resolvers<Context> = {
  Query: {
    me: (_, __, { playerId, player }) => {
      if (!playerId) {
        throw new ForbiddenError('Not logged in or invalid token');
      }
      return player;
    },
  },
};
