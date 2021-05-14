import * as React from 'react';
import { useSetRecoilState } from 'recoil';
import { errorExchange as urqlErrorExchange } from 'urql';
import { isAuthenticatedAtom } from './auth';

export function useErrorExchange() {
  const setAuthenticated = useSetRecoilState(isAuthenticatedAtom);

  return React.useMemo(
    () =>
      urqlErrorExchange({
        onError: (error) => {
          const isAuthError = error.graphQLErrors.some(
            (e) => e.extensions?.code === 'UNAUTHORIZED',
          );

          if (isAuthError) {
            localStorage.removeItem('aiacta:auth');
            setAuthenticated(false);
          } else {
            console.log(error);
          }
        },
      }),
    [],
  );
}
