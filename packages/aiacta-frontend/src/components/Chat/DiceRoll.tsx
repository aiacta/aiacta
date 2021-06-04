import { Text } from '@mantine/core';
import MDX from '@mdx-js/runtime';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRollsStatus } from '../Dice';
import { DieIcon } from './DieIcon';
import { RollResult } from './RollResult';

const components = {
  Die: DieIcon,
  RollResult: RollResult,
  p: Text,
};

export const RollingContext = React.createContext(false);

export function DiceRoll({
  createdAt,
  rolls,
  text,
}: {
  createdAt: string;
  rolls: string[];
  text: string;
}) {
  const { isRolling } = useRollsStatus(rolls, createdAt);

  const mdx = React.useMemo(
    () => <MDX children={text} components={components} />,
    [text],
  );

  return (
    <RollingContext.Provider value={isRolling}>
      <ErrorBoundary fallback={<>Render failed</>}>{mdx}</ErrorBoundary>
    </RollingContext.Provider>
  );
}
