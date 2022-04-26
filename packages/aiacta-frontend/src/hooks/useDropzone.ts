import { useWindowEvent } from '@mantine/hooks';
import { useCallback, useRef, useState } from 'react';
import { isTruthy } from '../util';

export function useDropzone<TElement extends HTMLElement = HTMLDivElement>({
  onDrop,
}: {
  onDrop: (files: File[]) => void | Promise<void>;
}) {
  const rootRef = useRef<TElement | null>(null);
  const [isActive, setActive] = useState(false);
  const [isProcessing, setProcessing] = useState(false);

  useWindowEvent('dragover', (evt) => {
    evt.preventDefault();
  });
  useWindowEvent('drop', (evt) => {
    if (rootRef.current && rootRef.current.contains(evt.target as Node)) {
      return;
    }
    evt.preventDefault();
  });

  const getRootProps = useCallback(
    () => ({
      ref: rootRef,
      onDragEnter: (evt: React.DragEvent<TElement>) => {
        evt.preventDefault();
        evt.stopPropagation();

        setActive(true);
      },
      onDragOver: (evt: React.DragEvent<TElement>) => {
        evt.preventDefault();
        evt.stopPropagation();

        evt.dataTransfer.dropEffect = 'copy';

        return false;
      },
      onDragLeave: (evt: React.DragEvent<TElement>) => {
        evt.preventDefault();
        evt.stopPropagation();

        setActive(false);
      },
      onDrop: (evt: React.DragEvent<TElement>) => {
        evt.preventDefault();
        evt.stopPropagation();

        setActive(false);

        const files = [...evt.dataTransfer.items]
          .filter((item) => item.kind === 'file')
          .map((d) => d.getAsFile())
          .filter(isTruthy);

        const maybePromise = onDrop(files);

        if (maybePromise instanceof Promise) {
          setProcessing(true);
          maybePromise.finally(() => setProcessing(false));
        }
      },
    }),
    [],
  );

  return { isActive, isProcessing, getRootProps };
}
