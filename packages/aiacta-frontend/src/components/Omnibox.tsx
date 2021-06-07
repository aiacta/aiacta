import {
  Card,
  Container,
  Divider,
  Highlight,
  Kbd,
  TextInput,
  Transition,
} from '@mantine/core';
import {
  useClickOutside,
  useFocusTrap,
  useMergedRef,
  useWindowEvent,
} from '@mantine/hooks';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    position: 'fixed',
    top: '20vh',
    left: '50%',
    transform: 'translate(-50%)',
  },
  inputKeys: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export function Omnibox() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [commandInput, setCommandInput] = React.useState('');

  const containerRef = React.useRef<HTMLDivElement>(
    null as any as HTMLDivElement,
  );
  const useClickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    setOpen(false);
  });
  const focusTrapRef = useFocusTrap(open);
  const mergedRef = useMergedRef(
    containerRef,
    useClickOutsideRef,
    focusTrapRef as any,
  );

  useWindowEvent('keydown', (event) => {
    if (event.code === 'KeyK' && (event.ctrlKey || event.metaKey)) {
      setCommandInput('');
      setOpen(true);
    }
    if (event.code === 'Escape') {
      setOpen(false);
    }
    if (event.code === 'Enter') {
      setOpen(false);
    }
  });

  const { formatMessage } = useIntl();

  return (
    <div ref={mergedRef} className={classes.container}>
      <Transition
        mounted={open}
        transition="slide-down"
        duration={100}
        timingFunction="ease"
      >
        {(style) => (
          <Card shadow="lg" style={style}>
            <TextInput
              value={commandInput}
              onChange={(event) => setCommandInput(event.target.value)}
              placeholder={formatMessage({
                defaultMessage: 'What would you like to do?',
              })}
              size={100}
              rightSection={
                <>
                  <Kbd>
                    <FormattedMessage
                      defaultMessage="{platform, select, MacIntel {⌘} other {Ctrl}}"
                      values={{ platform: navigator.platform }}
                    />
                  </Kbd>{' '}
                  <Kbd>K</Kbd>
                </>
              }
              rightSectionWidth={80}
              rightSectionProps={{
                style: {
                  paddingRight: 16,
                  pointerEvents: 'none',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                },
              }}
            />
            <Divider />
            <Container>
              <Highlight highlight={commandInput}>Option 1</Highlight>
              <Highlight highlight={commandInput}>Option 2</Highlight>
            </Container>
          </Card>
        )}
      </Transition>
    </div>
  );
}
