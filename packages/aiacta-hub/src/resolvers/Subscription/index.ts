import { SubscriptionDiceRollsResolver } from './diceRolls';
import { SubscriptionNewMessagesResolver } from './newMessages';

export const SubscriptionResolvers = [
  SubscriptionNewMessagesResolver,
  SubscriptionDiceRollsResolver,
];
