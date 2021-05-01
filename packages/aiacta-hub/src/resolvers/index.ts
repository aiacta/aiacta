import { Resolvers } from '@aiacta/graphql';
import { Context } from '../context';
import { MutationResolvers } from './Mutation';
import { QueryResolvers } from './Query';
import { SubscriptionResolvers } from './Subscription';
import { WorldResolvers } from './World';

export const resolvers: Resolvers<Context>[] = [
  ...QueryResolvers,
  ...MutationResolvers,
  ...SubscriptionResolvers,
  ...WorldResolvers,
];
