import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ApiProvider } from './api';
import { StyleProvider } from './hooks';

export function Provider({ children }: { children: React.ReactNode }) {
  const messages = useMessages();

  return (
    <RecoilRoot>
      <StyleProvider>
        <IntlProvider locale="en" messages={messages}>
          <ApiProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </ApiProvider>
        </IntlProvider>
      </StyleProvider>
    </RecoilRoot>
  );
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
