import { AnimateSharedLayout, motion } from 'framer-motion';
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
import {
  isAuthenticatedAtom,
  useLoginMutation,
  useSignUpMutation,
} from '../api';
import { useStylesheet } from '../hooks';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const MotionButton = motion(Button);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const MotionPanel = motion(Panel);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const MotionFormGroup = motion(FormGroup);

export function Login() {
  const classes = useStylesheet({
    container: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  });

  const [signingUp, setSigningUp] = React.useState(false);

  return (
    <div className={classes.container}>
      <AnimateSharedLayout>
        <MotionPanel layout bordered>
          {signingUp ? (
            <>
              <SignUpForm />
              <MotionButton
                layoutId="switchButton"
                layout="position"
                appearance="link"
                onClick={() => setSigningUp(false)}
              >
                <FormattedMessage defaultMessage="Login with existing player" />
              </MotionButton>
            </>
          ) : (
            <>
              <SignInForm />
              <MotionButton
                layoutId="switchButton"
                layout="position"
                appearance="link"
                onClick={() => setSigningUp(true)}
              >
                <FormattedMessage defaultMessage="Sign up as new player" />
              </MotionButton>
            </>
          )}
        </MotionPanel>
      </AnimateSharedLayout>
    </div>
  );
}

function SignInForm() {
  const [isLoggingIn, login] = useLoginMutation();
  const setAuthenticated = useSetRecoilState(isAuthenticatedAtom);

  return (
    <Form
      layout="inline"
      onSubmit={(_checked, evt) => {
        login(
          Object.fromEntries(new FormData(evt.currentTarget).entries()) as any,
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
        isLoggingIn.error ? { password: isLoggingIn.error.message } : undefined
      }
      disabled={isLoggingIn.fetching}
    >
      <MotionFormGroup layout="position" layoutId="name" controlId="name">
        <FormControlLabel>
          <FormattedMessage defaultMessage="Player" />
        </FormControlLabel>
        <FormControl name="name" style={{ width: 160 }} />
      </MotionFormGroup>

      <MotionFormGroup
        layout="position"
        layoutId="password"
        controlId="password"
      >
        <FormControlLabel>
          <FormattedMessage defaultMessage="Password" />
        </FormControlLabel>
        <FormControl
          name="password"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type="password"
          autoComplete="off"
          style={{ width: 160 }}
        />
      </MotionFormGroup>

      <MotionButton
        layout="position"
        layoutId="submit"
        type="submit"
        loading={isLoggingIn.fetching}
      >
        <FormattedMessage defaultMessage="Login" />
      </MotionButton>
    </Form>
  );
}

function SignUpForm() {
  const [isSigningUp, signUp] = useSignUpMutation();
  const setAuthenticated = useSetRecoilState(isAuthenticatedAtom);

  return (
    <Form
      layout="vertical"
      onSubmit={(_checked, evt) => {
        signUp(
          Object.fromEntries(new FormData(evt.currentTarget).entries()) as any,
        ).then(({ data }) => {
          if (data?.signUp?.token) {
            localStorage.setItem(
              'aiacta:auth',
              JSON.stringify({
                token: data.signUp.token,
              }),
            );
            setAuthenticated(true);
          }
        });
      }}
      formError={
        isSigningUp.error ? { password: isSigningUp.error.message } : undefined
      }
      disabled={isSigningUp.fetching}
    >
      <MotionFormGroup layout="position" layoutId="name" controlId="name">
        <FormControlLabel>
          <FormattedMessage defaultMessage="Player" />
        </FormControlLabel>
        <FormControl name="name" style={{ width: 160 }} />
      </MotionFormGroup>

      <MotionFormGroup
        layout="position"
        layoutId="password"
        controlId="password"
      >
        <FormControlLabel>
          <FormattedMessage defaultMessage="Password" />
        </FormControlLabel>
        <FormControl
          name="password"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type="password"
          autoComplete="off"
          style={{ width: 160 }}
        />
      </MotionFormGroup>

      <MotionFormGroup layout="position" controlId="password2">
        <FormControlLabel>
          <FormattedMessage defaultMessage="Password (repeat)" />
        </FormControlLabel>
        <FormControl
          name="password2"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type="password"
          autoComplete="off"
          style={{ width: 160 }}
        />
      </MotionFormGroup>

      <MotionButton
        layout="position"
        layoutId="submit"
        type="submit"
        loading={isSigningUp.fetching}
      >
        <FormattedMessage defaultMessage="Sign up" />
      </MotionButton>
    </Form>
  );
}
