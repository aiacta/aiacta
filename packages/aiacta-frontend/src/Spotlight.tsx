import { SpotlightProvider } from '@mantine/spotlight';
import * as React from 'react';

export function Spotlight({ children }: { children: React.ReactNode }) {
  return (
    <SpotlightProvider actions={[]} shortcut="mod + k" highlightQuery>
      {children}
    </SpotlightProvider>
  );
}
