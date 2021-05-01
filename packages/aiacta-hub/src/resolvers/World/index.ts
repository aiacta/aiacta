import { WorldIsListedResolver } from './isListed';
import { WorldIsPasswordProtectedResolver } from './isPasswordProtected';
import { WorldPlayersResolver } from './players';

export const WorldResolvers = [
  WorldIsListedResolver,
  WorldIsPasswordProtectedResolver,
  WorldPlayersResolver,
];
