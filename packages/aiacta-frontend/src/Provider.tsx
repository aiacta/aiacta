import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { RecoilRoot } from 'recoil';
import { ApiProvider } from './api';
import { StyleProvider } from './hooks';

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <StyleProvider>
        <IntlProvider locale="en">
          <ApiProvider>{children}</ApiProvider>
        </IntlProvider>
      </StyleProvider>
    </RecoilRoot>
  );
}
