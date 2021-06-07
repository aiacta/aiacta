import { MantineTheme, theming } from '@mantine/core';
import { useWindowEvent } from '@mantine/hooks';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedAtom } from './api';
import { Omnibox } from './components';
import { useColorScheme } from './hooks';
import { LoginPage, WorldPage, WorldsPage } from './pages';

const useStyles = createUseStyles(
  (theme: MantineTheme) => ({
    '@global': {
      body: {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[5]
            : theme.colors.gray[2],
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.black,
      },
      input: {
        '&:-webkit-autofill, &:-webkit-autofill:focus, &:-webkit-autofill:hover':
          {
            WebkitTextFillColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.black,
            WebkitBoxShadow: `0 0 0px 1000px ${
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white
            } inset !important`,
          },
      },
    },
  }),
  { theming },
);

export function App() {
  useStyles();

  const [, setColorScheme] = useColorScheme();
  useWindowEvent('keydown', (event) => {
    if (event.code === 'KeyJ' && (event.ctrlKey || event.metaKey)) {
      setColorScheme((colorScheme) =>
        colorScheme === 'dark' ? 'light' : 'dark',
      );
    }
  });

  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
      </>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<WorldsPage />} />
        <Route path="/worlds/join/:worldId" element={<WorldsPage />} />
        <Route path="/worlds/new" element={<WorldsPage />} />
        <Route path="/world/:worldId" element={<WorldPage />} />
      </Routes>
      <Omnibox />
    </>
  );
}
