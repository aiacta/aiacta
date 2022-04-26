import { useColorScheme as useQueryColorScheme } from '@mantine/hooks';
import { useRef } from 'react';
import { atom, SetterOrUpdater, useRecoilState } from 'recoil';

const colorSchemeAtom = atom<'light' | 'dark' | null>({
  key: 'colorScheme',
  default: null,
});

export function useColorScheme() {
  const colorScheme = useQueryColorScheme();

  const [appColorScheme, setAppColorScheme] = useRecoilState(colorSchemeAtom);
  const colorRef = useRef(appColorScheme ?? colorScheme);
  colorRef.current = appColorScheme ?? colorScheme;

  return [
    appColorScheme ?? colorScheme,
    ((valOrUpdater) => {
      setAppColorScheme(
        typeof valOrUpdater === 'function'
          ? valOrUpdater(colorRef.current)
          : valOrUpdater,
      );
    }) as SetterOrUpdater<'light' | 'dark'>,
  ] as const;
}
