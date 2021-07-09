import { Text } from '@mantine/core';
import MDX from '@mdx-js/runtime';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const components = {
  p: Text,
};

export function MessageText({ text }: { text: string }) {
  const mdx = React.useMemo(
    () => <MDX children={text} components={components} />,
    [text],
  );

  return <ErrorBoundary fallback={<>Render failed</>}>{mdx}</ErrorBoundary>;
}
