import {
  Button,
  Container,
  ElementsGroup,
  Paper,
  Text,
  Tooltip,
} from '@mantine/core';
import * as React from 'react';
import { MdAccessTime } from 'react-icons/md';
import { RiSendPlaneFill } from 'react-icons/ri';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import {
  useChatMessagesQuery,
  useNewChatMessagesSubscription,
  useSendMessageMutation,
} from '../api';
import { SynchronizedFormattedRelativeTime } from './SynchronizedFormattedRelativeTime';
import { TextDisplay, TextEditor, useTextEditorRef } from './TextEditor';

const useStyles = createUseStyles({
  container: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
  },
  messages: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowY: 'auto',
    maxHeight: '50vh',
    paddingRight: 5,
    '&::-webkit-scrollbar': {
      width: 5,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(73,125,189, 0.2)',
    },
  },
  message: {
    display: 'grid',
    gridTemplateAreas: `"from time" "body body"`,
    gridTemplateColumns: '1fr auto',
    marginBottom: 10,
  },
  from: {
    gridArea: 'from',
  },
  time: {
    gridArea: 'time',
    color: '#97969B',
  },
  body: {
    gridArea: 'body',
  },
});

export function Chat() {
  const classes = useStyles();

  const { worldId } = useParams();

  const [messages] = useChatMessagesQuery({ variables: { worldId } });
  const [mutation, sendMessage] = useSendMessageMutation();
  useNewChatMessagesSubscription({ variables: { worldId } });

  const editor = useTextEditorRef();

  return (
    <Container className={classes.container} padding={0} size={320}>
      <Paper padding="xs">
        <div className={classes.messages}>
          {[...(messages.data?.world?.messages ?? [])].map(
            (msg) =>
              msg && (
                <div key={msg.id} className={classes.message}>
                  <Text className={classes.from} size="xs">
                    <em>{msg.author.name}</em>
                  </Text>
                  <div className={classes.time}>
                    <Tooltip
                      label={
                        <SynchronizedFormattedRelativeTime
                          value={msg.createdAt}
                        />
                      }
                      withArrow
                      position="left"
                    >
                      <MdAccessTime />
                    </Tooltip>
                  </div>
                  <div className={classes.body}>
                    {msg.component ? (
                      <>
                        {msg.component}: {msg.text}
                      </>
                    ) : (
                      msg.text && (
                        <Text size="sm">
                          <TextDisplay value={msg.text} />
                        </Text>
                      )
                    )}
                  </div>
                </div>
              ),
          )}
        </div>
        <ElementsGroup spacing={0} position="left">
          <TextEditor
            ref={editor}
            readOnly={mutation.fetching}
            onPressEnter={(value) => {
              sendMessage({ worldId, text: value }).then(() =>
                editor.current.resetState(),
              );
            }}
          />
          <Button
            style={{ marginLeft: 'auto', height: 'auto', alignSelf: 'stretch' }}
            size="lg"
            onClick={() =>
              sendMessage({
                worldId,
                text: editor.current.getValue(),
              }).then(() => editor.current.resetState())
            }
          >
            <RiSendPlaneFill />
          </Button>
        </ElementsGroup>
      </Paper>
    </Container>
  );
}
