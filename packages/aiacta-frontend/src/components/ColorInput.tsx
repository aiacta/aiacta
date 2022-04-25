import {
  ColorSwatch,
  Input,
  InputProps,
  InputWrapper,
  InputWrapperBaseProps,
} from '@mantine/core';
import { useId } from '@mantine/hooks';
import * as React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  colorSwatch: {
    '&::-webkit-color-swatch-wrapper': {
      display: 'none',
    },
  },
  container: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: 'auto 1fr',
    gridGap: 8,
  },
});

export function ColorInput({
  label,
  description,
  error,
  required,
  id,
  style,
  className,
  elementRef,
  ...inputProps
}: InputWrapperBaseProps &
  InputProps<any> & {
    id?: string;
    value?: string;
    elementRef?: React.ForwardedRef<HTMLInputElement>;
    onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (evt: React.FocusEvent<HTMLInputElement>) => void;
  }) {
  const [value, setValue] = React.useState('#ffffff');
  const htmlId = useId(id);

  const classes = useStyles();

  const uncontrolled = {
    value,
    onChange: (evt: React.ChangeEvent<HTMLInputElement>) =>
      setValue(evt.currentTarget.value),
  };
  const controlled = {
    ...(inputProps.value && { value: inputProps.value }),
    ...(inputProps.onChange && { onChange: inputProps.onChange }),
  };

  return (
    <InputWrapper
      label={label}
      description={description}
      error={error}
      required={required}
      style={style}
      className={className}
      id={htmlId}
    >
      <div className={classes.container}>
        <ColorSwatch
          {...uncontrolled}
          {...controlled}
          id={htmlId}
          component="input"
          type="color"
          color={controlled.value ?? uncontrolled.value}
          className={classes.colorSwatch}
        />
        <Input {...uncontrolled} {...controlled} {...inputProps} />
      </div>
    </InputWrapper>
  );
}
