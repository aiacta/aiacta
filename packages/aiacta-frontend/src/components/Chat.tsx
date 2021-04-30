import { Send } from '@rsuite/icons';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { InputGroup, Panel } from 'rsuite';
import {
  useChatMessagesQuery,
  useNewChatMessagesSubscription,
  useSendMessageMutation,
} from '../api';
import { useStylesheet } from '../hooks';
import { TextDisplay, TextEditor, useTextEditorRef } from './TextEditor';

const Button = InputGroup.Button!;

export function Chat() {
  const classes = useStylesheet({
    container: {
      position: 'fixed',
      bottom: 0,
    },
  });

  const { worldId } = useParams();

  const [messages] = useChatMessagesQuery({ variables: { worldId } });
  const [mutation, sendMessage] = useSendMessageMutation();
  useNewChatMessagesSubscription({ variables: { worldId } });

  const editor = useTextEditorRef();

  return (
    <Panel bordered className={classes.container}>
      {messages.data?.world?.messages?.map(
        (msg) =>
          msg && (
            <div key={msg.id}>
              {msg.text && <TextDisplay value={msg.text} />}
            </div>
          ),
      )}
      <InputGroup>
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
          onClick={() =>
            sendMessage({ worldId, text: editor.current.getValue() }).then(() =>
              editor.current.resetState(),
            )
          }
          loading={mutation.fetching}
        >
          <Send />
        </Button>
      </InputGroup>
    </Panel>
  );
}
