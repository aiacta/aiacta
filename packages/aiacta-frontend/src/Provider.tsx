import { MantineProvider } from '@mantine/core';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { JssProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ApiProvider } from './api';
import { RollProvider } from './components';
import { useColorScheme } from './hooks';
import { Spotlight } from './Spotlight';

export function Provider({ children }: { children: React.ReactNode }) {
  const messages = useMessages();

  return (
    <RecoilRoot>
      <JssProvider>
        <ThemeProvider>
          <IntlProvider locale="en" messages={messages}>
            <ApiProvider>
              <BrowserRouter>
                <RollProvider>
                  <Spotlight>{children}</Spotlight>
                </RollProvider>
              </BrowserRouter>
            </ApiProvider>
          </IntlProvider>
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
