import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Text,
} from '@mantine/core';
import { BiLock } from 'react-icons/bi';
import { GiWorld } from 'react-icons/gi';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useAvailableWorldsQuery, useMeQuery } from '../api';
import { useSpotlightActions } from '../hooks';
import { isTruthy } from '../util';
import { JoinWorldForm } from './JoinWorldForm';
import { NewWorldForm } from './NewWorldForm';

export function WorldsList() {
  const [availableWorlds] = useAvailableWorldsQuery();
  const [me] = useMeQuery();

  const createWorld = useMatch('/worlds/new');
  const joinWorld = useMatch('/worlds/join/:worldId');
  const navigate = useNavigate();

  const { formatMessage } = useIntl();

  useSpotlightActions([
    {
      id: 'create-world',
      title: formatMessage({ defaultMessage: 'Create a world' }),
      onTrigger: () => {
        navigate('/worlds/new');
      },
      description: 'Create a new world from scratch',
    },
    ...(availableWorlds.data?.worlds
      ?.filter(isTruthy)
      .filter((world) =>
        world.players?.some((player) => player?.id === me.data?.me?.id),
      )
      .map((world) => ({
        id: `open-world-${world.id}`,
        title: formatMessage(
          { defaultMessage: 'Open world {world}' },
          { world: world.name },
        ),
        onTrigger: () => {
          navigate(`/world/${world.id}`);
        },
        description: 'Open this world',
      })) ?? []),
  ]);

  return (
    <>
      <Container size="sm">
        <Paper
          p="sm"
          shadow="sm"
          sx={{
            position: 'relative',
            display: 'grid',
            gridTemplateRows: '1fr auto',
            marginTop: '15vh',
            maxHeight: '70vh',
            '@media screen and (max-width: 425px)': {
              marginTop: '10vh',
              maxHeight: '70vh',
            },
          }}
        >
          <LoadingOverlay visible={availableWorlds.fetching} />
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              padding: 0,
              overflow: 'auto',
            }}
          >
            {availableWorlds.data?.worlds?.filter(isTruthy).map((world) => (
              <Box
                component="li"
                key={world.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gridGap: 8,
                  alignItems: 'center',
                }}
              >
                <div>
                  <GiWorld size={40} style={{ marginTop: 5 }} />
                </div>
                <div
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Text weight={600}>{world.name}</Text>
                  <Text size="xs">
                    <FormattedMessage
                      defaultMessage="GM: {name}"
                      values={{ name: world.creator?.name }}
                    />
                  </Text>
                </div>
                {me.data?.me &&
                world.players?.some(
                  (player) => player?.id === me.data?.me?.id,
                ) ? (
                  <Button
                    variant="subtle"
                    component={Link}
                    to={`/world/${world.id}`}
                  >
                    <FormattedMessage defaultMessage="Goto world" />
                  </Button>
                ) : (
                  <Button
                    variant="subtle"
                    component={Link}
                    to={`/worlds/join/${world.id}`}
                  >
                    {world.isPasswordProtected && <BiLock />}
                    <FormattedMessage defaultMessage="Join world" />
                  </Button>
                )}
              </Box>
            ))}
          </Box>
          <Group position="center">
            <Button
              size="xl"
              variant="outline"
              component={Link}
              to="/worlds/new"
            >
              <FormattedMessage defaultMessage="Create a new world" />
            </Button>
          </Group>
        </Paper>
      </Container>
      <NewWorldForm opened={!!createWorld} onClose={() => navigate('/')} />
      <JoinWorldForm opened={!!joinWorld} onClose={() => navigate('/')} />
    </>
  );
}
