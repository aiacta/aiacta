import { errorExchange as urqlErrorExchange } from 'urql';

export const errorExchange = (onLogout: () => void) =>
  urqlErrorExchange({
    onError: (error) => {
      const isAuthError = error.graphQLErrors.some(
        (e) => e.extensions?.code === 'UNAUTHORIZED',
      );

      if (isAuthError) {
        onLogout();
      } else {
        console.log(error);
      }
    },
  });
