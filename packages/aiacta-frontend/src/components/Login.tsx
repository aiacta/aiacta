import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSetRecoilState } from 'recoil';
import {
  Button,
  Form,
  FormControl,
  FormControlLabel,
  FormGroup,
  Panel,
} from 'rsuite';
import { isAuthenticatedAtom, useLoginMutation } from '../api';
import { useStylesheet } from '../hooks';

export function Login() {
  const classes = useStylesheet({
    container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  });

  const [isLoggingIn, login] = useLoginMutation();
  const setAuthenticated = useSetRecoilState(isAuthenticatedAtom);

  return (
    <Panel bordered className={classes.container}>
      <Form
        layout="inline"
        onSubmit={(_checked, evt) => {
          login(
            Object.fromEntries(
              new FormData(evt.currentTarget).entries(),
            ) as any,
          ).then(({ data }) => {
            if (data?.login?.token) {
              localStorage.setItem(
                'aiacta:auth',
                JSON.stringify({
                  token: data.login.token,
                }),
              );
              setAuthenticated(true);
            }
          });
        }}
        formError={
          isLoggingIn.error
            ? { password: isLoggingIn.error.message }
            : undefined
        }
        disabled={isLoggingIn.fetching}
      >
        <FormGroup controlId="name">
          <FormControlLabel>
            <FormattedMessage defaultMessage="Player" />
          </FormControlLabel>
          <FormControl name="name" style={{ width: 160 }} />
        </FormGroup>

        <FormGroup controlId="password">
          <FormControlLabel>
            <FormattedMessage defaultMessage="Password" />
          </FormControlLabel>
          <FormControl
            name="password"
            type="password"
            autoComplete="off"
            style={{ width: 160 }}
          />
        </FormGroup>

        <Button type="submit" loading={isLoggingIn.fetching}>
          <FormattedMessage defaultMessage="Login" />
        </Button>
      </Form>
    </Panel>
  );
}
