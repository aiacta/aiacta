import { SpotlightProvider } from '@mantine/spotlight';

export function Spotlight({ children }: { children: React.ReactNode }) {
  return (
    <SpotlightProvider actions={[]} shortcut="mod + k" highlightQuery>
      {children}
    </SpotlightProvider>
  );
}
