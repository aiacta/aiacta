import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldIsListedResolver: Resolvers<Context> = {
  World: {
    isListed: (world) => {
      return !world.inviteOnly;
    },
  },
};
