import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import 'rsuite/dist/styles/rsuite-dark.css';
import { isAuthenticatedAtom } from './api';
import { Chat, Login, Worlds } from './components';

export function App() {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Worlds />}></Route>
        <Route path="/world/:worldId" element={<Chat />}></Route>
      </Routes>
    </>
  );
}
