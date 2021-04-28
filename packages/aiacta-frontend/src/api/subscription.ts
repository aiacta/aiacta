import { createClient as createWSClient } from 'graphql-ws';
import { subscriptionExchange as urqlSubscriptionExchange } from 'urql';
export * from './hooks';

const wsClient = createWSClient({
  url: import.meta.env.PROD ? `wss://${location.host}` : 'wss://localhost:8080',
});

export const subscriptionExchange = urqlSubscriptionExchange({
  forwardSubscription(operation) {
    return {
      subscribe: (sink) => {
        const dispose = wsClient.subscribe(operation, sink);
        return {
          unsubscribe: dispose,
        };
      },
    };
  },
});
