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
import { matchSorter } from 'match-sorter';
import * as React from 'react';
import { defineMessage, FormattedMessage, useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { MeInWorldQuery, useMeInWorldQuery } from '../api';
import { useWorldId } from '../hooks';
import { zIndices } from '../util';

const useStyles = createUseStyles({
  container: {
    position: 'fixed',
    top: '20vh',
    left: '50%',
    transform: 'translate(-50%)',
    zIndex: zIndices.Modal,
  },
  inputKeys: {
    display: 'flex',
    flexDirection: 'row',
  },
  shake: {
    animation: '$shake 0.67s cubic-bezier(.36,.07,.19,.97) both',
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden',
    perspective: 1000,
  },
  '@keyframes shake': {
    '10%, 90%': {
      transform: 'translate3d(-1px, 0, 0)',
    },

    '20%, 80%': {
      transform: 'translate3d(2px, 0, 0)',
    },

    '30%, 50%, 70%': {
      transform: 'translate3d(-4px, 0, 0)',
    },

    '40%, 60%': {
      transform: 'translate3d(4px, 0, 0)',
    },
  },
});

export function Omnibox() {
  const classes = useStyles();

  const { formatMessage } = useIntl();
  const worldId = useWorldId();
  const [meInWorld] = useMeInWorldQuery({
    pause: !worldId,
    variables: worldId ? { worldId } : undefined,
  });

  const [{ open, selection, commandInput, options, error }, dispatch] =
    React.useReducer(
      (
        state: {
          open: boolean;
          selection: number | null;
          commandInput: string;
          options: { id: string; label: string }[];
          error?: string;
        },
        action:
          | { type: 'open' | 'close' | 'select' }
          | { type: 'type'; input: string },
      ) => {
        switch (action.type) {
          case 'open':
            return {
              ...state,
              open: true,
              selection: null,
              error: undefined,
              commandInput: '',
              options: [],
            };
          case 'close':
            if (!state.open) {
              return state;
            }
            return { ...state, open: false };
          case 'select':
            if (!state.open) {
              return state;
            }
            if (state.selection === null && state.options.length === 0) {
              return {
                ...state,
                error: formatMessage({ defaultMessage: 'No option selected' }),
              };
            }
            {
              const selectedOption = state.options[state.selection ?? 0];
              console.log(selectedOption);
            }
            // TODO do magic?
            return { ...state, open: false };
          case 'type':
            if (!state.open) {
              return state;
            }
            return {
              ...state,
              error: undefined,
              commandInput: action.input,
              options: matchSorter(
                tasks
                  .filter((task) => task.condition(meInWorld.data))
                  .map((task) => ({
                    ...task,
                    label: formatMessage(task.label),
                  })),
                action.input,
                { keys: ['label'] },
              ),
            };
        }
      },
      { open: false, selection: null, commandInput: '', options: [] },
    );

  const containerRef = React.useRef<HTMLDivElement>(
    null as any as HTMLDivElement,
  );
  const useClickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    dispatch({ type: 'close' });
  });
  const focusTrapRef = useFocusTrap(open);
  const mergedRef = useMergedRef(
    containerRef,
    useClickOutsideRef,
    focusTrapRef as any,
  );

  useWindowEvent('keydown', (event) => {
    switch (event.key) {
      case 'k':
        if (event.metaKey || event.ctrlKey) {
          dispatch({ type: 'open' });
        }
        break;
      case 'Escape':
        dispatch({ type: 'close' });
        break;
      case 'Enter': {
        dispatch({ type: 'select' });
        break;
      }
    }
  });

  return (
    <div ref={mergedRef} className={classes.container}>
      <Transition
        mounted={open}
        transition="slide-down"
        duration={100}
        timingFunction="ease"
      >
        {(style) => (
          <Card
            shadow="lg"
            style={style}
            className={error ? classes.shake : undefined}
          >
            <TextInput
              value={commandInput}
              onChange={(event) =>
                dispatch({ type: 'type', input: event.target.value })
              }
              placeholder={formatMessage({
                defaultMessage: 'What would you like to do?',
              })}
              size="xl"
              rightSection={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Kbd>
                    <FormattedMessage
                      defaultMessage="{platform, select, MacIntel {⌘} other {Ctrl}}"
                      values={{ platform: navigator.platform }}
                    />
                  </Kbd>
                  <span style={{ margin: '0 5px' }}>+</span>
                  <Kbd>K</Kbd>
                </div>
              }
              rightSectionWidth={80}
              onKeyDown={(evt) => {
                switch (evt.key) {
                  case 'ArrowDown': {
                    break;
                  }
                  case 'ArrowUp': {
                    break;
                  }
                }
              }}
              error={error}
            />
            <Divider />
            <Container>
              {options.map((task) => (
                <Highlight key={task.id} highlight={commandInput}>
                  {task.label}
                </Highlight>
              ))}
            </Container>
          </Card>
        )}
      </Transition>
    </div>
  );
}

const tasks = [
  {
    id: 'character',
    label: defineMessage({ defaultMessage: 'Create a character' }),
    condition: (context?: MeInWorldQuery) => !!context?.world?.me,
    onSelect: () => {
      //
    },
  },
];
