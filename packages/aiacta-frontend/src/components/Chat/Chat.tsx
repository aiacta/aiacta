import { Box, Button, Container, Paper, Textarea } from '@mantine/core';
import * as React from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import {
  useChatMessagesQuery,
  useNewChatMessagesSubscription,
  useSendMessageMutation,
} from '../../api';
import { isTruthy, zIndices } from '../../util';
import { ChatMessage } from './ChatMessage';

export function Chat() {
  return (
    <Container
      size={320}
      sx={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: zIndices.Chat,
      }}
      p={0}
    >
      <Paper p="xs">
        <Messages />
        <MessageInput />
      </Paper>
    </Container>
  );
}

function Messages() {
  const { worldId } = useParams();

  if (!worldId) {
    throw new Error('Invalid entry');
  }

  const [messages] = useChatMessagesQuery({ variables: { worldId } });
  useNewChatMessagesSubscription({ variables: { worldId } });

  return (
    <Box
      sx={{
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
      }}
    >
      {messages.fetching
        ? null
        : messages.data?.world?.messages
            ?.filter(isTruthy)
            .map((msg) => (
              <ChatMessage
                key={msg.id}
                id={msg.id}
                author={msg.author}
                createdAt={msg.createdAt}
                text={msg.text}
                rolls={msg.rolls?.filter(isTruthy)}
              />
            ))}
    </Box>
  );
}

function MessageInput() {
  const { worldId } = useParams();

  if (!worldId) {
    throw new Error('Invalid entry');
  }

  const [message, setMessage] = React.useState('');
  const [mutation, sendMessage] = useSendMessageMutation();

  return (
    <Textarea
      autosize
      value={message}
      onChange={({ currentTarget: { value } }) => setMessage(value)}
      readOnly={mutation.fetching}
      onKeyDown={(evt) => {
        if (evt.key === 'Enter' && !(evt.shiftKey || evt.metaKey)) {
          sendMessage({
            worldId,
            text: message,
          }).then(() => setMessage(''));
        }
      }}
      rightSection={
        <>
          <Button
            style={{ height: 'auto' }}
            disabled={mutation.fetching}
            onClick={() =>
              sendMessage({
                worldId,
                text: message,
              }).then(() => setMessage(''))
            }
          >
            <RiSendPlaneFill />
          </Button>
        </>
      }
      rightSectionWidth={52}
      styles={{ rightSection: { alignItems: 'stretch' } }}
    />
  );
}
