import { MutationLoginResolver } from './login';
import { MutationSendMessageResolver } from './sendMessage';
import { MutationSignUpResolver } from './signUp';

export const MutationResolvers = [
  MutationLoginResolver,
  MutationSignUpResolver,
  MutationSendMessageResolver,
];
