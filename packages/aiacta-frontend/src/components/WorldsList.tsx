import {
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Text,
} from '@mantine/core';
import * as React from 'react';
import { BiLock } from 'react-icons/bi';
import { GiWorld } from 'react-icons/gi';
import { FormattedMessage } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { useAvailableWorldsQuery, useMeQuery } from '../api';
import { isTruthy } from '../util';
import { JoinWorldForm } from './JoinWorldForm';
import { NewWorldForm } from './NewWorldForm';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: '1fr auto',
    marginTop: '15vh',
    maxHeight: '70vh',
    '@media screen and (max-width: 425px)': {
      marginTop: '10vh',
      maxHeight: '70vh',
    },
  },
  worlds: {
    listStyle: 'none',
    padding: 0,
    overflow: 'auto',
  },
  world: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gridGap: 8,
    alignItems: 'center',
  },
});

export function WorldsList() {
  const classes = useStyles();

  const [availableWorlds] = useAvailableWorldsQuery();
  const [me] = useMeQuery();

  const createWorld = useMatch('/worlds/new');
  const joinWorld = useMatch('/worlds/join/:worldId');
  const navigate = useNavigate();

  return (
    <>
      <Container size="sm">
        <Paper padding="sm" shadow="sm" className={classes.container}>
          <LoadingOverlay visible={availableWorlds.fetching} />
          <ul className={classes.worlds}>
            {availableWorlds.data?.worlds?.filter(isTruthy).map((world) => (
              <li key={world.id} className={classes.world}>
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
                    variant="link"
                    component={Link}
                    to={`/world/${world.id}`}
                  >
                    <FormattedMessage defaultMessage="Open world" />
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    component={Link}
                    to={`/worlds/join/${world.id}`}
                  >
                    {world.isPasswordProtected && <BiLock />}
                    <FormattedMessage defaultMessage="Join world" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
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
