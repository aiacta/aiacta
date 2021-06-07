import { WorldIsListedResolver } from './isListed';
import { WorldIsPasswordProtectedResolver } from './isPasswordProtected';
import { WorldMessagesResolver } from './messages';
import { WorldPlayersResolver } from './players';
import { WorldScenesResolver } from './scenes';

export const WorldResolvers = [
  WorldIsListedResolver,
  WorldIsPasswordProtectedResolver,
  WorldPlayersResolver,
  WorldMessagesResolver,
  WorldScenesResolver,
];
