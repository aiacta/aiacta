import * as React from 'react';
import { useRecoilValue } from 'recoil';
import 'rsuite/dist/styles/rsuite-dark.css';
import { isAuthenticatedAtom } from './api';
import { Chat, Login } from './components';

export function App() {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <Chat />
    </>
  );
}
