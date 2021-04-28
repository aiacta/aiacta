import { cacheExchange as urqlCacheExchange } from '@urql/exchange-graphcache';
import { ChatMessagesDocument } from './hooks';
import schema from './schema.json';

export const cacheExchange = urqlCacheExchange({
  schema: schema as any,
  updates: {
    Subscription: {
      newMessages(result, _args, cache, _info) {
        cache.updateQuery({ query: ChatMessagesDocument }, (data) => {
          data.world.messages.push(...(result.newMessages as any[]));
          return data;
        });
      },
    },
  },
});
