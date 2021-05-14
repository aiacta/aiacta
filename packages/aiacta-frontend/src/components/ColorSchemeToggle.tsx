import { ActionIcon } from '@mantine/core';
import * as React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useColorScheme } from '../hooks';

export function ColorSchemeToggle() {
  const [colorScheme, setColorScheme] = useColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() =>
        setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'))
      }
      title="Toggle color scheme"
    >
      {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
    </ActionIcon>
  );
}
