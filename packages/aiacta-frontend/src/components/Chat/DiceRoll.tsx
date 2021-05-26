import { Text } from '@mantine/core';
import MDX from '@mdx-js/runtime';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useRollsStatus } from '../Dice';
import { DieIcon } from './DieIcon';

const components = {
  Die: DieIcon,
  p: Text,
};

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

  return (
    <ErrorBoundary fallback={<>Render failed</>}>
      <MDX children={text} scope={{ isRolling }} components={components} />
    </ErrorBoundary>
  );
}
