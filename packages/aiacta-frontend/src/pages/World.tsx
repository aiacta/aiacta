import { useIntl } from 'react-intl';
import { Chat, DiceBox, Scenes } from '../components';
import { useSpotlightActions } from '../hooks';

export function WorldPage() {
  const { formatMessage } = useIntl();

  useSpotlightActions([
    {
      id: 'create-character',
      title: formatMessage({ defaultMessage: 'Create a character' }),
      onTrigger: () => {
        //
      },
      description: 'Create a new character from scratch',
    },
  ]);

  return (
    <>
      <Chat />
      <DiceBox />
      <Scenes />
    </>
  );
}
