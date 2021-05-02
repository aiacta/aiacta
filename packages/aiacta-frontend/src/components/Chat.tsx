import { Send, Time } from '@rsuite/icons';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { InputGroup, Panel, Tooltip, Whisper } from 'rsuite';
import {
  useChatMessagesQuery,
  useNewChatMessagesSubscription,
  useSendMessageMutation,
} from '../api';
import { useStylesheet } from '../hooks';
import { SynchronizedFormattedRelativeTime } from './SynchronizedFormattedRelativeTime';
import { TextDisplay, TextEditor, useTextEditorRef } from './TextEditor';

const Button = InputGroup.Button!;

export function Chat() {
  const classes = useStylesheet({
    container: {
      position: 'fixed',
      bottom: 0,
      maxWidth: 400,
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

  const { worldId } = useParams();

  const [messages] = useChatMessagesQuery({ variables: { worldId } });
  const [mutation, sendMessage] = useSendMessageMutation();
  useNewChatMessagesSubscription({ variables: { worldId } });

  const editor = useTextEditorRef();

  return (
    <Panel bordered className={classes.container}>
      {[...(messages.data?.world?.messages ?? [])].reverse().map(
        (msg) =>
          msg && (
            <div key={msg.id} className={classes.message}>
              <div className={classes.from}>
                <em>{msg.author.name}</em>
              </div>
              <div className={classes.time}>
                <Whisper
                  trigger="hover"
                  speaker={
                    <Tooltip>
                      <SynchronizedFormattedRelativeTime
                        value={msg.createdAt}
                      />
                    </Tooltip>
                  }
                >
                  <Time />
                </Whisper>
              </div>
              <div className={classes.body}>
                {msg.text && <TextDisplay value={msg.text} />}
              </div>
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
