import { Box, Text, Tooltip } from '@mantine/core';
import MDX from '@mdx-js/runtime';
import { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MdAccessTime } from 'react-icons/md';
import { useRollsStatus } from '../Dice';
import { SynchronizedFormattedRelativeTime } from '../SynchronizedFormattedRelativeTime';
import { components, RollingContext } from './ChatComponents';

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
  // const classes = useStyles();

  return (
    <Box
      key={id}
      sx={{
        display: 'grid',
        gridTemplateAreas: `"from time" "body body"`,
        gridTemplateColumns: '1fr auto',
        marginBottom: 10,
      }}
    >
      <Text sx={{ gridArea: 'from' }} size="xs">
        <em>{author.name}</em>
      </Text>
      <Box sx={{ gridArea: 'time', color: '#97969B' }}>
        <Tooltip
          label={<SynchronizedFormattedRelativeTime value={createdAt} />}
          withArrow
          position="left"
        >
          <MdAccessTime />
        </Tooltip>
      </Box>
      <Box sx={{ gridArea: 'body', transformOrigin: 'top center' }}>
        <RenderMessage rolls={rolls} text={text} createdAt={createdAt} />
      </Box>
    </Box>
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

  const mdx = useMemo(
    () => <MDX children={text ?? ''} components={components} />,
    [text],
  );

  return (
    <RollingContext.Provider value={isRolling}>
      <ErrorBoundary fallback={<>Render failed</>}>{mdx}</ErrorBoundary>
    </RollingContext.Provider>
  );
}
