import { useContext } from 'react';
import { RollingContext } from './RollingContext';

export function RollResult({ value }: { value: number }) {
  const isRolling = useContext(RollingContext);

  return <>{isRolling ? '?' : value}</>;
}
