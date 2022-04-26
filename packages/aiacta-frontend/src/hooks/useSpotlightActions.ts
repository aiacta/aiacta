import { SpotlightAction, useSpotlight } from '@mantine/spotlight';
import { useEffect } from 'react';

export function useSpotlightActions(actions: SpotlightAction[]) {
  const { registerActions, removeActions } = useSpotlight();

  useEffect(() => {
    registerActions(actions);
    return () => {
      removeActions(['create-character']);
    };
  }, []);
}
