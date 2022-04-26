import { useSpotlight } from '@mantine/spotlight';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Chat, DiceBox, Scenes } from '../components';

export function WorldPage() {
  const { formatMessage } = useIntl();
  const { registerActions, removeActions } = useSpotlight();

  React.useEffect(() => {
    registerActions([
      {
        id: 'create-character',
        title: formatMessage({ defaultMessage: 'Create a character' }),
        onTrigger: () => {
          //
        },
        description: 'Create a new character from scratch',
      },
    ]);
    return () => {
      removeActions(['create-character']);
    };
  }, []);

  return (
    <>
      <Chat />
      <DiceBox />
      <Scenes />
    </>
  );
}
