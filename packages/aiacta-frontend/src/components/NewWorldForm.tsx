import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Radio,
  RadioGroup,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useCreateWorldMutation } from '../api';

export function NewWorldForm({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const { formatMessage } = useIntl();

  const form = useForm({
    initialValues: {
      name: '',
      joinMode: 'open',
      password: '',
    },
  });

  const [newWorld, createWorld] = useCreateWorldMutation();
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<FormattedMessage defaultMessage="New World" />}
      size="lg"
    >
      <form
        onSubmit={form.onSubmit(({ name, joinMode, password }) =>
          createWorld({
            name,
            inviteOnly: joinMode === 'inviteOnly',
            password: joinMode === 'password' ? password : null,
          }).then(({ data }) => {
            if (data?.createWorld?.id) {
              navigate(`/world/${data?.createWorld?.id}`, { replace: true });
            } else {
              // TODO handle error
            }
          }),
        )}
      >
        <TextInput
          required
          placeholder={formatMessage({ defaultMessage: 'World name' })}
          label={<FormattedMessage defaultMessage="Name" />}
          autoComplete="worldname"
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

        <RadioGroup
          sx={{ marginTop: 10 }}
          label={<FormattedMessage defaultMessage="Listing" />}
          description={
            <FormattedMessage defaultMessage="Select how players will join your world" />
          }
          value={form.values.joinMode}
          onChange={(value) => form.setFieldValue('joinMode', value)}
        >
          <Radio
            value="open"
            label={<FormattedMessage defaultMessage="Open for everyone" />}
          />
          <Radio
            value="password"
            label={<FormattedMessage defaultMessage="Password protected" />}
          />
          <Radio
            value="inviteOnly"
            label={<FormattedMessage defaultMessage="Invite only" />}
          />
        </RadioGroup>

        {form.values.joinMode === 'password' && (
          <PasswordInput
            required
            sx={{ marginTop: 10 }}
            placeholder={formatMessage({ defaultMessage: 'Password' })}
            label={<FormattedMessage defaultMessage="Password" />}
            autoComplete="new-password"
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
          />
        )}

        <Group position="right" sx={{ marginTop: 25 }}>
          <Button color="primary" type="submit" sx={{ position: 'relative' }}>
            <LoadingOverlay visible={newWorld.fetching} />
            <FormattedMessage defaultMessage="Create world" />
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
