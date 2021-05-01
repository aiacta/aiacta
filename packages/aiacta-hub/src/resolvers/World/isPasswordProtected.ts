import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldIsPasswordProtectedResolver: Resolvers<Context> = {
  World: {
    isPasswordProtected: (world) => {
      return world.inviteOnly ? false : !!world.password;
    },
  },
};
