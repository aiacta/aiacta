import {
  ColorPicker,
  InputWrapper,
  InputWrapperBaseProps,
  Sx,
  useMantineTheme,
} from '@mantine/core';
import { useId } from '@mantine/hooks';
import { useState } from 'react';

export function ColorInput({
  label,
  description,
  error,
  required,
  id,
  sx,
  ...inputProps
}: InputWrapperBaseProps & {
  id?: string;
  sx?: Sx;
  value: string;
  onChange?: (color: string) => void;
  onFocus?: (evt: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const [value, setValue] = useState('#ffffff');
  const htmlId = useId(id);

  const uncontrolled = {
    value,
    onChange: (color: string) => setValue(color),
  };
  const controlled = {
    ...(inputProps.value && { value: inputProps.value }),
    ...(inputProps.onChange && { onChange: inputProps.onChange }),
  };

  const theme = useMantineTheme();
  const colors = Object.keys(theme.colors).filter((c) => c !== 'dark');

  return (
    <>
      <InputWrapper
        label={label}
        description={description}
        error={error}
        required={required}
        id={htmlId}
        sx={sx}
      >
        <ColorPicker
          format="hex"
          swatches={colors.map((color) => theme.colors[color][7])}
          swatchesPerRow={colors.length}
          fullWidth
          withPicker={false}
          {...uncontrolled}
          {...controlled}
        />
        {controlled.value ?? value}
      </InputWrapper>
    </>
  );
}
