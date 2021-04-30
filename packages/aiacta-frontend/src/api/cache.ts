import { cacheExchange as urqlCacheExchange } from '@urql/exchange-graphcache';
import { ChatMessagesDocument } from './hooks';
import schema from './schema.json';

export const cacheExchange = urqlCacheExchange({
  schema: schema as any,
  updates: {
    Subscription: {
      newMessages(result, variables, cache, _info) {
        cache.updateQuery(
          { query: ChatMessagesDocument, variables },
          (data) => {
            data.world.messages.push(...(result.newMessages as any[]));
            return data;
          },
        );
      },
    },
  },
});
