import { Close, EyeClose, Global, Shield } from '@rsuite/icons';
import { useAnimation } from 'framer-motion';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  Message,
  Modal,
  Panel,
  Placeholder,
  Popover,
  Radio,
  RadioGroup,
  Row,
  Whisper,
} from 'rsuite';
import { WhisperInstance } from 'rsuite/es/Whisper';
import {
  useAvailableWorldsQuery,
  useCreateWorldMutation,
  useJoinWorldMutation,
  useMeQuery,
} from '../api';
import { useStylesheet } from '../hooks';
import { MotionButton } from './Motion';

export function Worlds() {
  const classes = useStylesheet({
    container: {
      maxWidth: 'min(90vw, 1000px)',
      margin: 'min(10vh, 200px) auto',
    },
    centered: {
      display: 'grid',
      justifyContent: 'center',
      alignItems: 'center',
      height: 60,
    },
    title: {
      gridTemplateColumns: 'auto 1fr',
      alignItems: 'baseline',
      alignContent: 'center',
      justifyContent: 'start',
      gridGap: 8,
    },
    slimText: {
      fontSize: '0.8em',
      color: '#97969B',
      fontWeight: 'lighter',
    },
    loader: {
      margin: '20px 25px',
      '&:first-of-type': {
        marginTop: 0,
      },
    },
    createWorld: {
      marginTop: 20,
      height: 60,
    },
  });

  const [availableWorlds] = useAvailableWorldsQuery();
  const [me] = useMeQuery();

  return (
    <Panel bordered className={classes.container}>
      {availableWorlds.fetching ? (
        <>
          {new Array(3).fill(null).map((_, idx) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <Placeholder.Paragraph
              key={idx}
              graph="circle"
              active
              className={classes.loader}
            />
          ))}
        </>
      ) : availableWorlds.error ? (
        <Message showIcon type="error">
          <FormattedMessage
            defaultMessage="Failed to load worlds{code, select, na {} other {: ERR{code}}}"
            values={{
              code: 'na',
              ...availableWorlds.error.graphQLErrors.find(
                (e) => e.extensions && 'userFacing' in e.extensions,
              )?.extensions?.userFacing,
            }}
          />
        </Message>
      ) : (
        <List bordered>
          {availableWorlds.data?.worlds?.map((world) => {
            if (!world) {
              return null;
            }
            const Icon = !world.isListed
              ? EyeClose
              : world.isPasswordProtected
              ? Shield
              : Global;
            return (
              <List.Item key={world.id}>
                <Grid fluid>
                  <Row>
                    <Col xs={12} sm={4} md={3}>
                      <Icon style={{ fontSize: '3em' }} />
                    </Col>
                    <Col xs={12} sm={12} md={10}>
                      <div>{world.name}</div>
                      <div className={classes.slimText}>
                        <FormattedMessage
                          defaultMessage="GM: {name}"
                          values={{ name: world.creator?.name }}
                        />
                      </div>
                    </Col>
                    <Col xsHidden smHidden md={5}>
                      <FormattedMessage
                        defaultMessage="{count, plural, one {One player} other {{count} players}}"
                        values={{ count: world.players?.length }}
                      />
                    </Col>
                    <Col xs={24} sm={8} md={6}>
                      {me.data?.me &&
                      world.players?.some(
                        (player) => player?.id === me.data?.me?.id,
                      ) ? (
                        <Button
                          appearance="link"
                          block
                          as={Link}
                          to={`world/${world.id}`}
                        >
                          <FormattedMessage defaultMessage="Open world" />
                        </Button>
                      ) : (
                        <JoinButton
                          worldId={world.id}
                          passwordProtected={world.isPasswordProtected}
                        />
                      )}
                    </Col>
                  </Row>
                </Grid>
              </List.Item>
            );
          })}
        </List>
      )}
      <CreateNewWorld className={classes.createWorld} />
    </Panel>
  );
}

function CreateNewWorld({ className }: { className: string }) {
  const [open, setOpen] = React.useState(false);

  const [joinMode, setJoinMode] = React.useState('open');

  const [creatingWorld, createWorld] = useCreateWorldMutation();
  const navigate = useNavigate();

  return (
    <>
      <Button
        appearance="ghost"
        block
        className={className}
        onClick={() => setOpen(true)}
      >
        <FormattedMessage defaultMessage="Create a new world" />
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onExited={() => setJoinMode('open')}
        backdrop={creatingWorld.fetching ? 'static' : undefined}
      >
        <Form
          layout="horizontal"
          onSubmit={(_checked, evt) => {
            const { name, joinMode, password } = Object.fromEntries(
              new FormData(evt.currentTarget).entries(),
            ) as any;
            createWorld({
              name,
              inviteOnly: joinMode === 'inviteOnly',
              password: joinMode === 'password' ? password : null,
            }).then(({ data }) => {
              if (data?.createWorld?.id) {
                navigate(`world/${data?.createWorld?.id}`);
              } else {
                // TODO handle error
              }
            });
          }}
          formError={
            creatingWorld.error
              ? { name: creatingWorld.error.message }
              : undefined
          }
          disabled={creatingWorld.fetching}
        >
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Modal.Header>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Modal.Title>
              <FormattedMessage defaultMessage="New world" />
            </Modal.Title>
          </Modal.Header>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Modal.Body>
            <FormGroup controlId="name">
              <FormControlLabel>
                <FormattedMessage defaultMessage="Name" />
              </FormControlLabel>
              <FormControl name="name" />
            </FormGroup>

            <FormGroup controlId="joinMode">
              <FormControlLabel>
                <FormattedMessage defaultMessage="Listing" />
              </FormControlLabel>
              <FormControl
                name="joinMode"
                accepter={RadioGroup}
                value={joinMode}
                onChange={(value) => setJoinMode(value)}
              >
                <Radio value="open">
                  <FormattedMessage defaultMessage="Open for everyone" />
                </Radio>
                <Radio value="password">
                  <FormattedMessage defaultMessage="Password protected" />
                </Radio>
                <Radio value="inviteOnly">
                  <FormattedMessage defaultMessage="Invite only" />
                </Radio>
              </FormControl>
            </FormGroup>

            {joinMode === 'password' && (
              <FormGroup controlId="password">
                <FormControlLabel>
                  <FormattedMessage defaultMessage="Password" />
                </FormControlLabel>
                <FormControl
                  name="password"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  type="password"
                  autoComplete="off"
                />
              </FormGroup>
            )}
          </Modal.Body>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Modal.Footer>
            <Button
              onClick={() => setOpen(false)}
              appearance="subtle"
              disabled={creatingWorld.fetching}
            >
              <FormattedMessage defaultMessage="Cancel" />
            </Button>
            <Button
              type="submit"
              appearance="primary"
              loading={creatingWorld.fetching}
            >
              <FormattedMessage defaultMessage="Create world" />
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

function JoinButton({
  worldId,
}: // passwordProtected,
{
  worldId: string;
  passwordProtected: boolean;
}) {
  const [joiningWorld, joinWorld] = useJoinWorldMutation();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const shake = useAnimation();
  const triggerRef = React.useRef<WhisperInstance>();

  return (
    <Whisper
      ref={triggerRef}
      trigger="none"
      speaker={
        <Popover>
          {error}
          <IconButton
            size="xs"
            icon={<Close />}
            onClick={() => triggerRef.current?.close()}
          />
        </Popover>
      }
    >
      <MotionButton
        animate={shake}
        loading={joiningWorld.fetching}
        appearance="link"
        block
        onClick={() =>
          joinWorld({ worldId }).then(({ data, error }) => {
            if (data?.joinWorld?.id) {
              navigate(`world/${data?.joinWorld?.id}`);
            } else {
              shake.start({
                translateX: [-1, 2, -4, 4, -3, 2, 0],
                transition: { duration: 0.3 },
              });
              setError(
                error?.graphQLErrors.find(
                  (e) => e.extensions && 'userFacing' in e.extensions,
                )?.message ??
                  error?.graphQLErrors[0]?.message ??
                  'Could not join world',
              );
              triggerRef.current?.open();
            }
          })
        }
      >
        <FormattedMessage defaultMessage="Join world" />
      </MotionButton>
    </Whisper>
  );
}
