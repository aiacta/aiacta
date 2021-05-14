import * as React from 'react';
import { atom, SetterOrUpdater, useRecoilState } from 'recoil';

const colorSchemeAtom = atom<'light' | 'dark' | null>({
  key: 'colorScheme',
  default: null,
});

export function useColorScheme() {
  const queryRef = React.useRef<MediaQueryList>();
  if (!queryRef.current) {
    queryRef.current = window.matchMedia('(prefers-color-scheme: dark)');
  }
  const [colorScheme, setColorScheme] = React.useState(
    queryRef.current.matches ? ('dark' as const) : ('light' as const),
  );

  React.useEffect(() => {
    return attachMediaListener(queryRef.current!, (event) =>
      setColorScheme(event.matches ? 'dark' : 'light'),
    );
  });

  const [appColorScheme, setAppColorScheme] = useRecoilState(colorSchemeAtom);
  const colorRef = React.useRef(appColorScheme ?? colorScheme);
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

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void;

function attachMediaListener(
  query: MediaQueryList,
  callback: MediaQueryCallback,
) {
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
