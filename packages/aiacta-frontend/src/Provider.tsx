import { MantineProvider } from '@mantine/core';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { JssProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ApiProvider } from './api';
import { StyleProvider, useColorScheme } from './hooks';

export function Provider({ children }: { children: React.ReactNode }) {
  const messages = useMessages();

  return (
    <RecoilRoot>
      <JssProvider>
        <ThemeProvider>
          <StyleProvider>
            <IntlProvider locale="en" messages={messages}>
              <ApiProvider>
                <BrowserRouter>{children}</BrowserRouter>
              </ApiProvider>
            </IntlProvider>
          </StyleProvider>
        </ThemeProvider>
      </JssProvider>
    </RecoilRoot>
  );
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme] = useColorScheme();

  return <MantineProvider theme={{ colorScheme }}>{children}</MantineProvider>;
}

function useMessages() {
  if (import.meta.env.PROD) {
    const [messages, setMessages] = React.useState(undefined);
    React.useEffect(() => {
      fetch('/lang/en.json')
        .then((resp) => resp.json())
        .then((msg) => setMessages(msg));
    }, []);
    return messages;
  } else {
    const [messages] = React.useState(undefined);
    React.useEffect(() => {
      // noop
    }, []);
    return messages;
  }
}
