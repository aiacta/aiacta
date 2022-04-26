import {
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLoginMutation, useSignUpMutation } from '../api';
import { ColorInput } from './ColorInput';

export function LoginForm() {
  const { formatMessage } = useIntl();

  const [mode, setMode] = React.useState('signup' as 'signup' | 'signin');

  const theme = useMantineTheme();
  const colors = Object.keys(theme.colors).filter((c) => c !== 'dark');

  const form = useForm({
    initialValues: {
      name: '',
      password: '',
      color: theme.colors[colors[Math.floor(Math.random() * colors.length)]][7],
    },

    validate: {
      color: (color) =>
        /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i.test(color) ||
        /(rgb)a?\((\s*\d+%?\s*?,?\s*){2}(\s*\d+%?\s*?,?\s*\)?)(\s*,?\s*\/?\s*(0?\.?\d+%?\s*)?|1|0)?\)$/i.test(
          color,
        )
          ? null
          : 'Invalid color',
    },
  });

  const [signingIn, signIn] = useLoginMutation();
  const [signingUp, signUp] = useSignUpMutation();

  return (
    <Container size="xs">
      <Paper p="sm" shadow="sm" sx={{ marginTop: '20vh' }}>
        <form
          id={mode}
          onSubmit={form.onSubmit((values) => {
            if (mode === 'signin') {
              signIn(values);
            } else {
              signUp(values);
            }
          })}
        >
          <TextInput
            key={`${mode}_name`}
            sx={{ marginTop: 10 }}
            required
            placeholder={formatMessage({ defaultMessage: 'Your name' })}
            label={<FormattedMessage defaultMessage="Name" />}
            autoComplete="username"
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue('name', event.currentTarget.value)
            }
            onFocus={() => form.setFieldError('name', false)}
            error={
              form.errors.name && (
                <FormattedMessage defaultMessage="This name is already taken" />
              )
            }
          />

          <PasswordInput
            key={`${mode}_pw`}
            sx={{ marginTop: 10 }}
            required
            placeholder={formatMessage({ defaultMessage: 'Password' })}
            label={<FormattedMessage defaultMessage="Password" />}
            autoComplete={mode === 'signup' ? 'new-password' : 'password'}
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
          />

          {mode === 'signup' && (
            <ColorInput
              sx={{ marginTop: 10 }}
              required
              label={<FormattedMessage defaultMessage="Color" />}
              value={form.values.color}
              onChange={(color) => form.setFieldValue('color', color)}
              onFocus={() => form.setFieldError('color', false)}
              error={
                form.errors.color && (
                  <FormattedMessage defaultMessage="Use a valid color (e.g. #rrggbb)" />
                )
              }
            />
          )}

          {(mode === 'signin' ? signingIn : signingUp).error && (
            <Text color="red" size="sm" sx={{ marginTop: 10 }}>
              {(mode === 'signin' ? signingIn : signingUp).error?.message}
            </Text>
          )}

          <Group position="apart" sx={{ marginTop: 25 }}>
            <Button
              variant="subtle"
              color="gray"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signup' ? (
                <FormattedMessage defaultMessage="Have an account? Login" />
              ) : (
                <FormattedMessage defaultMessage="Don't have an account? Register" />
              )}
            </Button>
            {mode === 'signup' && (
              <Button
                variant="subtle"
                color="gray"
                onClick={() =>
                  signIn({ name: 'Test Account', password: 'test' }).then(
                    (result) => {
                      if (result.error) {
                        return signUp({
                          name: 'Test Account',
                          password: 'test',
                        });
                      }
                      return result;
                    },
                  )
                }
              >
                <FormattedMessage defaultMessage="Don't want to register? Use the test account" />
              </Button>
            )}
            <Button color="primary" type="submit" sx={{ position: 'relative' }}>
              <LoadingOverlay
                visible={signingIn.fetching || signingUp.fetching}
              />
              {mode === 'signup' ? (
                <FormattedMessage defaultMessage="Sign Up" />
              ) : (
                <FormattedMessage defaultMessage="Sign In" />
              )}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
