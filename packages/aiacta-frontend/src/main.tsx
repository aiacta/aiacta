/// <reference types="react/next" />
/// <reference types="react-dom/next" />

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Provider } from './Provider';

const useMocks = false;
if (import.meta.env.DEV && useMocks) {
  import('./mocks').then(({ worker }) => worker.start());
}

const root = createRoot(document.querySelector('#root')!);

root.render(
  <Provider>
    <App />
  </Provider>,
);
