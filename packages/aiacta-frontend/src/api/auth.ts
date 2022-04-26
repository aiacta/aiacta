import { authExchange as urqlAuthExchange } from '@urql/exchange-auth';
import { useMemo } from 'react';
import { atom, useSetRecoilState } from 'recoil';
import { makeOperation } from 'urql';

interface AuthState {
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export const isAuthenticatedAtom = atom({
  key: 'authenticated',
  default: !!localStorage.getItem('aiacta:auth'),
});

export function useAuthExchange() {
  const setAuthenticated = useSetRecoilState(isAuthenticatedAtom);

  return useMemo(
    () =>
      urqlAuthExchange<AuthState>({
        addAuthToOperation: ({ authState, operation }) => {
          if (!authState || !authState.token) {
            return operation;
          }

          const fetchOptions =
            typeof operation.context.fetchOptions === 'function'
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions ?? {};

          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Authorization: authState.token,
              },
            },
          });
        },
        willAuthError: ({ authState }) => {
          if (!authState) {
            return true;
          }
          if (authState.expiresAt) {
            const OneMinute = 60 * 1000;
            return (
              new Date(authState.expiresAt).getTime() - OneMinute <= Date.now()
            );
          }
          return false;
        },
        getAuth: async ({ authState }) => {
          if (!authState) {
            try {
              const auth = JSON.parse(
                localStorage.getItem('aiacta:auth') ?? '{}',
              );
              if (auth.token) {
                return auth;
              }
            } catch {}
            return null;
          }

          localStorage.removeItem('aiacta:auth');
          setAuthenticated(false);

          return null;
        },
      }),
    [],
  );
}
