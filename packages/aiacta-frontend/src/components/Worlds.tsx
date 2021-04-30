import { Global } from '@rsuite/icons';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button, FlexboxGrid, List, Panel } from 'rsuite';
import { useAvailableWorldsQuery, useMeQuery } from '../api';
import { clsx, useStylesheet } from '../hooks';

const ListItem = List.Item!;
const FlexboxGridItem = FlexboxGrid.Item!;

export function Worlds() {
  const classes = useStylesheet({
    container: {
      maxWidth: 1000,
      margin: '200px auto',
    },
    centered: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 60,
    },
    title: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflow: 'hidden',
    },
    slimText: {
      fontSize: '0.8em',
      color: '#97969B',
      fontWeight: 'lighter',
      position: 'absolute',
      bottom: 3,
    },
  });

  const [availableWorlds] = useAvailableWorldsQuery();
  const [me] = useMeQuery();

  return (
    <Panel bordered className={classes.container}>
      <List bordered>
        {availableWorlds.data?.worlds?.map(
          (world) =>
            world && (
              <ListItem key={world.id}>
                <FlexboxGrid>
                  <FlexboxGridItem colspan={2} className={classes.centered}>
                    <Global style={{ fontSize: '3em' }} />
                  </FlexboxGridItem>
                  <FlexboxGridItem
                    colspan={9}
                    className={clsx(classes.centered, classes.title)}
                  >
                    <div>{world.name}</div>
                    <div className={classes.slimText}>
                      <FormattedMessage
                        defaultMessage="GM: {name}"
                        values={{ name: world.creator?.name }}
                      />
                    </div>
                  </FlexboxGridItem>
                  <FlexboxGridItem colspan={9} className={classes.centered}>
                    <FormattedMessage
                      defaultMessage="{count, plural, one {One player} other {{count} players}}"
                      values={{ count: world.players?.length }}
                    />
                  </FlexboxGridItem>
                  <FlexboxGridItem colspan={4} className={classes.centered}>
                    <Button
                      appearance="link"
                      as={Link}
                      to={`world/${world.id}`}
                    >
                      {me.data?.me &&
                      world.players?.some(
                        (player) => player?.id === me.data?.me?.id,
                      ) ? (
                        <FormattedMessage defaultMessage="Open world" />
                      ) : (
                        <FormattedMessage defaultMessage="Join world" />
                      )}
                    </Button>
                  </FlexboxGridItem>
                </FlexboxGrid>
              </ListItem>
            ),
        )}
      </List>
    </Panel>
  );
}
