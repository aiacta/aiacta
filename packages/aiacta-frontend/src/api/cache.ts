import { cacheExchange as urqlCacheExchange } from '@urql/exchange-graphcache';
import { useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import { isAuthenticatedAtom } from './auth';
import {
  AvailableWorldsDocument,
  ChatMessagesDocument,
  ListScenesDocument,
} from './hooks';
import schema from './schema.json';

export function useCacheExchange() {
  const setAuthenticated = useSetRecoilState(isAuthenticatedAtom);

  return useMemo(
    () =>
      urqlCacheExchange({
        schema: schema as any,
        keys: {
          GridSettings: () => null,
          Point: () => null,
          Wall: () => null,
          Light: () => null,
        },
        updates: {
          Mutation: {
            createWorld(result, _variables, cache) {
              cache.updateQuery({ query: AvailableWorldsDocument }, (data) => {
                data.worlds.push(result.createWorld);
                return data;
              });
            },
            createScene(result, variables, cache) {
              cache.updateQuery(
                { query: ListScenesDocument, variables },
                (data) => {
                  data.world.scenes.push(result.createScene);
                  return data;
                },
              );
            },
            login(result) {
              if (result.login) {
                const { token } = result.login as any;
                localStorage.setItem('aiacta:auth', JSON.stringify({ token }));
                setAuthenticated(true);
              }
            },
            signUp(result) {
              if (result.signUp) {
                const { token } = result.signUp as any;
                localStorage.setItem('aiacta:auth', JSON.stringify({ token }));
                setAuthenticated(true);
              }
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
      }),
    [],
  );
}
