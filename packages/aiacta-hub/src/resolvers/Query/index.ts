import { QueryMeResolver } from './me';
import { QueryWorldResolver } from './world';
import { QueryWorldsResolver } from './worlds';

export const QueryResolvers = [
  QueryMeResolver,
  QueryWorldResolver,
  QueryWorldsResolver,
];
