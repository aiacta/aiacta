import { WorldIsListedResolver } from './isListed';
import { WorldIsPasswordProtectedResolver } from './isPasswordProtected';
import { WorldMeResolver } from './me';
import { WorldMessagesResolver } from './messages';
import { WorldPlayersResolver } from './players';
import { WorldSceneResolver } from './scene';
import { WorldScenesResolver } from './scenes';

export const WorldResolvers = [
  WorldIsListedResolver,
  WorldIsPasswordProtectedResolver,
  WorldPlayersResolver,
  WorldMessagesResolver,
  WorldScenesResolver,
  WorldSceneResolver,
  WorldMeResolver,
];
