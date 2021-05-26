import { Button, Container, Group, Paper, Text, Tooltip } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { MdAccessTime } from 'react-icons/md';
import { RiSendPlaneFill } from 'react-icons/ri';
import { createUseStyles } from 'react-jss';
import { useParams } from 'react-router-dom';
import {
  useChatMessagesQuery,
  useNewChatMessagesSubscription,
  useSendMessageMutation,
} from '../../api';
import { isTruthy, zIndices } from '../../util';
import { SynchronizedFormattedRelativeTime } from '../SynchronizedFormattedRelativeTime';
import { TextDisplay, TextEditor, useTextEditorRef } from '../TextEditor';
import { DiceRoll } from './DiceRoll';

const useStyles = createUseStyles({
  container: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: zIndices.Chat,
  },
  messages: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowX: 'hidden',
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
    transformOrigin: 'top center',
  },
});

export function Chat() {
  const classes = useStyles();

  return (
    <Container className={classes.container} padding={0} size={320}>
      <Paper padding="xs">
        <Messages />
        <MessageInput />
      </Paper>
    </Container>
  );
}

function Messages() {
  const classes = useStyles();

  const { worldId } = useParams();

  const [messages] = useChatMessagesQuery({ variables: { worldId } });
  useNewChatMessagesSubscription({ variables: { worldId } });

  return (
    <div className={classes.messages}>
      {messages.fetching ? null : (
        <AnimatePresence initial={false}>
          {messages.data?.world?.messages?.filter(isTruthy).map((msg) => (
            <Message
              key={msg.id}
              id={msg.id}
              author={msg.author}
              createdAt={msg.createdAt}
              component={msg.component}
              text={msg.text}
              rolls={msg.rolls?.filter(isTruthy)}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

function Message({
  id,
  author,
  createdAt,
  component,
  text,
  rolls,
}: {
  id: string;
  author: { name: string };
  createdAt: string;
  component?: string | null;
  text?: string | null;
  rolls?: string[] | null;
}) {
  const classes = useStyles();

  const renderedComponent = renderMessage({
    component,
    rolls,
    text,
    createdAt,
  });

  return (
    <div key={id} className={classes.message}>
      <Text className={classes.from} size="xs">
        <em>{author.name}</em>
      </Text>
      <div className={classes.time}>
        <Tooltip
          label={<SynchronizedFormattedRelativeTime value={createdAt} />}
          withArrow
          position="left"
        >
          <MdAccessTime />
        </Tooltip>
      </div>
      <motion.div
        initial={{ height: 0, scaleY: 0 }}
        animate={{ height: 'auto', scaleY: 1 }}
        className={classes.body}
      >
        {renderedComponent ??
          (text && (
            <Text size="sm">
              <TextDisplay value={text} />
            </Text>
          ))}
      </motion.div>
    </div>
  );
}

function MessageInput() {
  const { worldId } = useParams();

  const [mutation, sendMessage] = useSendMessageMutation();

  const editor = useTextEditorRef();

  return (
    <Group spacing={0} position="left">
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
    </Group>
  );
}

function renderMessage({
  component,
  text,
  createdAt,
  ...rest
}: {
  createdAt: string;
  component?: string | null;
  text?: string | null;
  rolls?: string[] | null;
}) {
  switch (component) {
    case 'DiceRoll': {
      return (
        <DiceRoll
          createdAt={createdAt}
          rolls={rest.rolls ?? []}
          text={text ?? ''}
        />
      );
    }
  }
  return null;
}
