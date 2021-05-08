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

// #style-7::-webkit-scrollbar-track
// {
//   -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
//   background-color: #F5F5F5;
//   border-radius: 10px;
// }

// #style-7::-webkit-scrollbar
// {
//   width: 10px;
//   background-color: #F5F5F5;
// }

// #style-7::-webkit-scrollbar-thumb
// {
//   border-radius: 10px;
//   background-image: -webkit-gradient(linear,
//                      left bottom,
//                      left top,
//                      color-stop(0.44, rgb(122,153,217)),
//                      color-stop(0.72, rgb(73,125,189)),
//                      color-stop(0.86, rgb(28,58,148)));
// }

export function Chat() {
  const classes = useStylesheet({
    container: {
      position: 'fixed',
      left: 0,
      bottom: 0,
      maxWidth: 400,
    },
    messages: {
      flex: '1 1 auto',
      overflowY: 'auto',
      maxHeight: '50vh',
      paddingRight: 5,
      $nest: {
        '&::-webkit-scrollbar': {
          width: 5,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(73,125,189, 0.2)',
        },
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

  const { worldId } = useParams();

  const [messages] = useChatMessagesQuery({ variables: { worldId } });
  const [mutation, sendMessage] = useSendMessageMutation();
  useNewChatMessagesSubscription({ variables: { worldId } });

  const editor = useTextEditorRef();

  const messagesRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    if (messagesRef.current) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        lastElementChild,
      } = messagesRef.current;
      if (
        scrollHeight -
          clientHeight -
          (lastElementChild?.clientHeight ?? 0) -
          scrollTop -
          10 <=
        0
      ) {
        messagesRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  return (
    <Panel bordered className={classes.container}>
      <div ref={messagesRef} className={classes.messages}>
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
      </div>
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
        <InputGroup.Button
          onClick={() =>
            sendMessage({
              worldId,
              text: editor.current.getValue(),
            }).then(() => editor.current.resetState())
          }
          loading={mutation.fetching}
        >
          <Send />
        </InputGroup.Button>
      </InputGroup>
    </Panel>
  );
}
