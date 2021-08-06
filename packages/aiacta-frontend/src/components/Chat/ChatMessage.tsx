import { Text, Tooltip } from '@mantine/core';
import MDX from '@mdx-js/runtime';
import { motion } from 'framer-motion';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MdAccessTime } from 'react-icons/md';
import { createUseStyles } from 'react-jss';
import { zIndices } from '../../util';
import { useRollsStatus } from '../Dice';
import { SynchronizedFormattedRelativeTime } from '../SynchronizedFormattedRelativeTime';
import { components, RollingContext } from './ChatComponents';

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

export function ChatMessage({
  id,
  author,
  createdAt,
  text,
  rolls,
}: {
  id: string;
  author: { name: string };
  createdAt: string;
  text?: string | null;
  rolls?: string[] | null;
}) {
  const classes = useStyles();

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
        <RenderMessage rolls={rolls} text={text} createdAt={createdAt} />
      </motion.div>
    </div>
  );
}

function RenderMessage({
  text,
  createdAt,
  rolls,
}: {
  createdAt: string;
  text?: string | null;
  rolls?: string[] | null;
}) {
  const { isRolling } = useRollsStatus(rolls ?? [], createdAt);

  const mdx = React.useMemo(
    () => <MDX children={text} components={components} />,
    [text],
  );

  return (
    <RollingContext.Provider value={isRolling}>
      <ErrorBoundary fallback={<>Render failed</>}>{mdx}</ErrorBoundary>
    </RollingContext.Provider>
  );
}
