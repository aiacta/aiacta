import * as React from 'react';
import { StrictMode } from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { Provider } from './Provider';

const useMocks = false;
if (import.meta.env.DEV && useMocks) {
  import('./mocks').then(({ worker }) => worker.start());
}

render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
  document.querySelector('#root'),
);
