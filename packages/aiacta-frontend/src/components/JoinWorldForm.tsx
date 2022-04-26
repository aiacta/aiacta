import { Button, Group, Modal, PasswordInput, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useJoinWorldMutation, useWorldToJoinQuery } from '../api';

export function JoinWorldForm({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const { worldId } = useParams();

  const [world] = useWorldToJoinQuery({
    pause: !worldId,
    variables: { worldId: worldId ?? '' },
  });
  const [joiningWorld, joinWorld] = useJoinWorldMutation();

  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!world.fetching && world.data?.world?.isPasswordProtected === false) {
      joinWorld({ worldId: worldId ?? '' }).then(({ data }) => {
        if (data?.joinWorld?.id) {
          navigate(`/world/${data.joinWorld.id}`);
        }
      });
    }
  }, [world]);

  return (
    <>
      <Modal
        title={<FormattedMessage defaultMessage="Password-protected world" />}
        opened={opened && !!world.data?.world?.isPasswordProtected}
        onClose={onClose}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            joinWorld({ worldId: worldId ?? '', password }).then(({ data }) => {
              if (data?.joinWorld?.id) {
                navigate(`/world/${data.joinWorld.id}`);
              }
            });
          }}
        >
          <PasswordInput
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            autoComplete="password"
          />

          {joiningWorld.error && (
            <Text color="red" size="sm" style={{ marginTop: 10 }}>
              {joiningWorld.error?.message}
            </Text>
          )}

          <Group style={{ marginTop: 25 }} position="right">
            <Button color="primary" type="submit">
              <FormattedMessage defaultMessage="Join world" />
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}
