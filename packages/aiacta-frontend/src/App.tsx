import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import 'rsuite/dist/styles/rsuite-dark.css';
import { isAuthenticatedAtom } from './api';
import { LoginPage, WorldPage, WorldsPage } from './pages';

export function App() {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<WorldsPage />}></Route>
        <Route path="/world/:worldId" element={<WorldPage />}></Route>
      </Routes>
    </>
  );
}
