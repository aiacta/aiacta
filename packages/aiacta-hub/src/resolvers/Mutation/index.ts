import { MutationCreateSceneResolver } from './createScene';
import { MutationCreateWorldResolver } from './createWorld';
import { MutationJoinWorldResolver } from './joinWorld';
import { MutationLoginResolver } from './login';
import { MutationRollDiceResolver } from './rollDice';
import { MutationSendMessageResolver } from './sendMessage';
import { MutationSignUpResolver } from './signUp';

export const MutationResolvers = [
  MutationLoginResolver,
  MutationSignUpResolver,
  MutationSendMessageResolver,
  MutationCreateWorldResolver,
  MutationJoinWorldResolver,
  MutationRollDiceResolver,
  MutationCreateSceneResolver,
];
