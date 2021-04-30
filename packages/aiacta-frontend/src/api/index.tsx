import { devtoolsExchange } from '@urql/devtools';
import * as React from 'react';
import { atom, useRecoilState } from 'recoil';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { authExchange } from './auth';
import { cacheExchange } from './cache';
import { errorExchange } from './error';
import { subscriptionExchange } from './subscription';

export * from './hooks';

export const isAuthenticatedAtom = atom({
  key: 'authenticated',
  default: !!localStorage.getItem('aiacta:auth'),
});

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useRecoilState(
    isAuthenticatedAtom,
  );

  const client = React.useMemo(() => {
    return createClient({
      url: '/api',
      exchanges: [
        devtoolsExchange,
        dedupExchange,
        cacheExchange,
        errorExchange(() => {
          localStorage.removeItem('aiacta:auth');
          setAuthenticated(false);
        }),
        authExchange(() => {
          localStorage.removeItem('aiacta:auth');
          setAuthenticated(false);
        }),
        fetchExchange,
        subscriptionExchange,
      ],
    });
  }, [isAuthenticated]);

  return <Provider value={client}>{children}</Provider>;
}
