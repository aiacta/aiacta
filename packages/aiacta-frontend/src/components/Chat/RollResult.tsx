import * as React from 'react';
import { RollingContext } from './DiceRoll';

export function RollResult({ value }: { value: number }) {
  const isRolling = React.useContext(RollingContext);

  return isRolling ? '?' : value;
}
