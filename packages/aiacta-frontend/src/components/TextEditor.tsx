import {
  convertFromRaw,
  convertToRaw,
  DraftHandleValue,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
} from 'draft-js';
import * as React from 'react';
import { Input } from 'rsuite';
import { useStylesheet } from '../hooks';

export const TextEditor = React.forwardRef(function TextEditor(
  {
    initialValue,
    onChange,
    onPressEnter,
    ...props
  }: {
    initialValue?: string;
    onChange?: (value: string) => void;
    onPressEnter?: (value: string) => void;
    readOnly?: boolean;
  },
  ref,
) {
  const [state, setState] = React.useState(() =>
    initialValue
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(initialValue)))
      : EditorState.createEmpty(),
  );

  const onChangeEditorState = React.useCallback(
    (value: EditorState) => {
      setState(value);
      onChange?.(JSON.stringify(convertToRaw(value.getCurrentContent())));
    },
    [onChange],
  );

  const onSubmit = React.useCallback(
    (value: EditorState) => {
      onPressEnter?.(JSON.stringify(convertToRaw(value.getCurrentContent())));
    },
    [onPressEnter],
  );

  const stateRef = React.useRef(state);
  stateRef.current = state;

  React.useImperativeHandle(
    ref,
    () =>
      ({
        getState: () => stateRef.current,
        setState: (state: EditorState) => setState(state),
        getValue: () =>
          JSON.stringify(convertToRaw(stateRef.current.getCurrentContent())),
        resetState: () =>
          setState((pref) => {
            const blocks = pref.getCurrentContent().getBlockMap().toList();
            const updatedSelection = pref.getSelection().merge({
              anchorKey: blocks.first().get('key'),
              anchorOffset: 0,
              focusKey: blocks.last().get('key'),
              focusOffset: blocks.last().getLength(),
            });
            const newContentState = Modifier.removeRange(
              pref.getCurrentContent(),
              updatedSelection,
              'forward',
            );
            return EditorState.push(pref, newContentState, 'remove-range');
          }),
      } as TextEditorInterface),
  );

  return (
    <Input
      as={DraftEditor}
      editorState={state}
      onChangeEditorState={onChangeEditorState}
      onSubmit={onSubmit as any}
      {...props}
    />
  );
});

interface TextEditorInterface {
  getState: () => EditorState;
  setState: (state: EditorState) => void;
  getValue: () => string;
  resetState: () => void;
}

export function useTextEditorRef() {
  return React.useRef<TextEditorInterface>({
    getState: () => {
      throw new Error('You likely forgot ref={editorRef}');
    },
    setState: () => {
      throw new Error('You likely forgot ref={editorRef}');
    },
    getValue: () => {
      throw new Error('You likely forgot ref={editorRef}');
    },
    resetState: () => {
      throw new Error('You likely forgot ref={editorRef}');
    },
  } as TextEditorInterface);
}

export function TextDisplay({ value }: { value: string }) {
  const state = React.useMemo(
    () => EditorState.createWithContent(convertFromRaw(JSON.parse(value))),
    [],
  );

  return (
    <Editor
      editorState={state}
      readOnly
      onChange={() => {
        //
      }}
    />
  );
}

const DraftEditor = React.forwardRef(function DraftEditor(
  { onSubmit, editorState, onChangeEditorState, ...props }: any,
  _ref,
) {
  const classes = useStylesheet({
    input: {
      padding: '7px 11px',
      width: '100%',
      minWidth: 300,
    },
  });

  const keyBindingFn = React.useCallback(
    (evt: React.KeyboardEvent<unknown>) => {
      if (
        onSubmit &&
        evt.key === 'Enter' &&
        !KeyBindingUtil.isSoftNewlineEvent(evt)
      ) {
        return 'submit';
      }

      return getDefaultKeyBinding(evt);
    },
    [onSubmit],
  );

  const handleKeyCommand = React.useCallback(
    (command: string): DraftHandleValue => {
      if (command === 'submit') {
        onSubmit(editorState);
      }

      return 'not-handled';
    },
    [onSubmit, editorState],
  );

  const ref = React.useRef<Editor>();
  const prevReadOnly = React.useRef(props.readOnly);
  const focus = React.useRef(false);

  const onFocus = React.useCallback((evt: React.SyntheticEvent) => {
    props.onFocus?.(evt);
    focus.current = true;
  }, []);
  const onBlur = React.useCallback((evt: React.SyntheticEvent) => {
    props.onBlur?.(evt);
    focus.current = false;
  }, []);

  React.useEffect(() => {
    if (!props.readOnly && prevReadOnly.current && focus.current) {
      ref.current?.focus();
    }
    prevReadOnly.current = props.readOnly;
  }, [props.readOnly]);

  return (
    <div className={classes.input}>
      <Editor
        {...props}
        ref={ref}
        editorState={editorState}
        onChange={onChangeEditorState}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={handleKeyCommand}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
});
