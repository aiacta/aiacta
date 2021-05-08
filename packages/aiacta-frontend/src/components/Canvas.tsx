import { useContextBridge } from '@react-three/drei';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import * as React from 'react';
import { IntlContext } from 'react-intl';
import { useParams } from 'react-router-dom';
import { Context as UrqlContext } from 'urql';
import { useDiceRollsSubscription } from '../api';
import { DiceBox } from './Dice';
import { Physics } from './Physics';

export function Canvas() {
  const ContextBridge = useContextBridge(UrqlContext, IntlContext);

  const { worldId } = useParams();

  const [rolls] = useDiceRollsSubscription({ variables: { worldId } });

  return (
    <ThreeCanvas
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        left: 0,
        top: 0,
        pointerEvents: 'none',
      }}
      camera={{
        position: [0, 0, 80],
        fov: 20,
      }}
    >
      <ContextBridge>
        <ambientLight />
        <spotLight
          intensity={0.6}
          position={[0, 0, 60]}
          angle={2}
          penumbra={1}
          castShadow
        />
        <Physics>
          <React.Suspense fallback={null}>
            <DiceBox rolls={rolls.data?.diceRolls} />
          </React.Suspense>
        </Physics>
      </ContextBridge>
    </ThreeCanvas>
  );
}
