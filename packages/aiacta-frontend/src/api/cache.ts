import { cacheExchange as urqlCacheExchange } from '@urql/exchange-graphcache';
import { AvailableWorldsDocument, ChatMessagesDocument } from './hooks';
import schema from './schema.json';

export const cacheExchange = urqlCacheExchange({
  schema: schema as any,
  updates: {
    Mutation: {
      createWorld(result, _variables, cache) {
        cache.updateQuery({ query: AvailableWorldsDocument }, (data) => {
          data.worlds.push(result.createWorld);
          return data;
        });
      },
    },
    Subscription: {
      newMessages(result, variables, cache, _info) {
        cache.updateQuery(
          { query: ChatMessagesDocument, variables },
          (data) => {
            if (!data.world.messages) {
              data.world.messages = [];
            }
            data.world.messages.unshift(
              ...[...(result.newMessages as any[])].reverse(),
            );
            return data;
          },
        );
      },
    },
  },
});
