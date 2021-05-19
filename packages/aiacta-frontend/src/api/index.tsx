import { devtoolsExchange } from '@urql/devtools';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { isAuthenticatedAtom, useAuthExchange } from './auth';
import { useCacheExchange } from './cache';
import { useErrorExchange } from './error';
import { subscriptionExchange } from './subscription';

export * from './hooks';
export { isAuthenticatedAtom };

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);

  const cacheExchange = useCacheExchange();
  const errorExchange = useErrorExchange();
  const authExchange = useAuthExchange();

  const client = React.useMemo(() => {
    return createClient({
      url: '/api',
      exchanges: [
        devtoolsExchange,
        dedupExchange,
        cacheExchange,
        errorExchange,
        authExchange,
        fetchExchange,
        subscriptionExchange,
      ],
    });
  }, [isAuthenticated]);

  return <Provider value={client}>{children}</Provider>;
}
