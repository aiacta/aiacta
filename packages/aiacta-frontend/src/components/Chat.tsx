import { Send } from '@rsuite/icons';
import * as React from 'react';
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

  const [messages] = useChatMessagesQuery();
  const [mutation, sendMessage] = useSendMessageMutation();
  useNewChatMessagesSubscription();

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
            sendMessage({ text: value }).then(() =>
              editor.current.resetState(),
            );
          }}
        />
        <Button
          onClick={() =>
            sendMessage({ text: editor.current.getValue() }).then(() =>
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
