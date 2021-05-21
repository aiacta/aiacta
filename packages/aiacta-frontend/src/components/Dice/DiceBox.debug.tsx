import * as React from 'react';
import { Die } from './Die';

export function DebugDice() {
  return (
    <>
      <DebugDiceGroup type="d4" offset={-10} />
      <DebugDiceGroup type="d6" offset={-6} />
      <DebugDiceGroup type="d8" offset={-2} />
      <DebugDiceGroup type="d10" offset={2} />
      <DebugDiceGroup type="d12" offset={6} />
      <DebugDiceGroup type="d20" offset={10} />
    </>
  );
}

export function DebugDiceGroup({
  offset,
  type,
}: {
  offset: number;
  type: any;
}) {
  return (
    <>
      <Die
        key={Math.random().toString()}
        type={type}
        position={[-10, offset, 10]}
        angularVelocity={[0, 0, 0]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[-5, offset, 10]}
        angularVelocity={[-5, 0, 0]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[0, offset, 10]}
        angularVelocity={[0, -5, 0]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[5, offset, 10]}
        angularVelocity={[0, 0, -5]}
      />
      <Die
        key={Math.random().toString()}
        type={type}
        position={[10, offset, 10]}
        angularVelocity={[4, 3, 2]}
      />
    </>
  );
}

export function ExpectedTestRolls({
  rotation,
  type,
  offset,
}: {
  rotation?: [number, number, number];
  type: any;
  offset: number;
}) {
  return (
    <>
      {Array.from({ length: +type.slice(1) }, (_, i) => (
        <Die
          key={Math.random()}
          type={type}
          position={[-10 + 2 * i, offset, 10]}
          rotation={rotation}
          targetValue={i + 1}
        />
      ))}
    </>
  );
}

export function DebugFour() {
  return (
    <>
      {/* lands on 1 */}
      <ExpectedTestRolls type="d4" offset={-5} rotation={[0, 120, 30]} />
      {/* lands on 2 */}
      <ExpectedTestRolls type="d4" offset={0} rotation={[20, 0, 0]} />
      {/* lands on 4 */}
      <ExpectedTestRolls type="d4" offset={-10} rotation={[0, 0, 0]} />
      {/* lands on 3 */}
      <ExpectedTestRolls type="d4" offset={5} rotation={[0, 30, 0]} />
    </>
  );
}

export function DebugSix() {
  return (
    <>
      {/* lands on 1 */}
      <ExpectedTestRolls type="d6" offset={-10} rotation={[180, 0, 0]} />
      {/* lands on 2 */}
      <ExpectedTestRolls type="d6" offset={-7} rotation={[90, 0, 0]} />
      {/* lands on 3 */}
      <ExpectedTestRolls type="d6" offset={-4} rotation={[0, 90, 0]} />
      {/* lands on 4 */}
      <ExpectedTestRolls type="d6" offset={-1} rotation={[0, 270, 0]} />
      {/* lands on 5 */}
      <ExpectedTestRolls type="d6" offset={2} rotation={[270, 0, 0]} />
      {/* lands on 6 */}
      <ExpectedTestRolls type="d6" offset={5} />
    </>
  );
}

export function DebugEight() {
  return (
    <>
      {/* lands on 5 */}
      <ExpectedTestRolls type="d8" offset={-10} rotation={[45, 45, 0]} />
      {/* lands on 2 */}
      <ExpectedTestRolls type="d8" offset={-5} rotation={[45, 45, 45]} />
      {/* lands on 7 */}
      <ExpectedTestRolls type="d8" offset={-3} rotation={[45, 45, 90]} />
      {/* lands on 8 */}
      <ExpectedTestRolls type="d8" offset={0} rotation={[45, 145, 90]} />
    </>
  );
}

export function DebugTen() {
  return (
    <>
      {/* lands on 2 */}
      <ExpectedTestRolls type="d10" offset={-10} rotation={[45, 145, 90]} />
      {/* lands on 8 */}
      <ExpectedTestRolls type="d10" offset={-6} rotation={[45, 145, 0]} />
      {/* lands on 5 */}
      <ExpectedTestRolls type="d10" offset={-3} rotation={[45, 0, 0]} />
      {/* lands on 7 */}
      <ExpectedTestRolls type="d10" offset={0} rotation={[-10, 0, 0]} />
    </>
  );
}

export function DebugTwelve() {
  return (
    <>
      {/* lands on 11 */}
      <ExpectedTestRolls type="d12" offset={-9} rotation={[-10, 0, 0]} />
      {/* lands on 1 */}
      <ExpectedTestRolls type="d12" offset={-5} rotation={[-10, 90, 0]} />
    </>
  );
}
