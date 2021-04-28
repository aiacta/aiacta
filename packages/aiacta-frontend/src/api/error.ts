import { errorExchange as urqlErrorExchange } from 'urql';

export const errorExchange = urqlErrorExchange({
  onError: (error) => {
    const isAuthError = error.graphQLErrors.some(
      (e) => e.extensions?.code === 'FORBIDDEN',
    );

    if (isAuthError) {
      // clear storage, log the user out etc
      console.log(error);
    } else {
      console.log(error);
    }
  },
});
