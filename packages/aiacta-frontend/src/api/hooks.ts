import { gql } from 'urql';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum Role {
  Gamemaster = 'GAMEMASTER',
  User = 'USER',
}

export type AuthInfo = {
  __typename?: 'AuthInfo';
  token: Scalars['String'];
  player: Player;
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<AuthInfo>;
  sendMessage?: Maybe<Message>;
  signUp?: Maybe<AuthInfo>;
};

export type MutationLoginArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type MutationSendMessageArgs = {
  worldId: Scalars['ID'];
  input: MessageInput;
};

export type MutationSignUpArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type World = {
  __typename?: 'World';
  id: Scalars['ID'];
  name: Scalars['String'];
  players?: Maybe<Array<Maybe<PlayerInWorld>>>;
  messages?: Maybe<Array<Maybe<Message>>>;
};

export type PlayerInfo = {
  id: Scalars['ID'];
  name: Scalars['String'];
  color: Scalars['String'];
};

export type PlayerInWorld = PlayerInfo & {
  __typename?: 'PlayerInWorld';
  id: Scalars['ID'];
  name: Scalars['String'];
  color: Scalars['String'];
  role: Role;
};

export type Player = PlayerInfo & {
  __typename?: 'Player';
  id: Scalars['ID'];
  name: Scalars['String'];
  color: Scalars['String'];
  worlds?: Maybe<Array<Maybe<World>>>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  component?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type MessageInput = {
  component?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  worlds?: Maybe<Array<Maybe<World>>>;
  world?: Maybe<World>;
};

export type QueryWorldArgs = {
  id: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessages: Array<Maybe<Message>>;
};

export type SubscriptionNewMessagesArgs = {
  worldId: Scalars['ID'];
};

export type ChatMessagesQueryVariables = Exact<{ [key: string]: never }>;

export type ChatMessagesQuery = { __typename?: 'Query' } & {
  world?: Maybe<
    { __typename?: 'World' } & {
      messages?: Maybe<
        Array<
          Maybe<
            { __typename?: 'Message' } & Pick<
              Message,
              'id' | 'component' | 'text'
            >
          >
        >
      >;
    }
  >;
};

export type SendMessageMutationVariables = Exact<{
  text?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
}>;

export type SendMessageMutation = { __typename?: 'Mutation' } & {
  sendMessage?: Maybe<
    { __typename?: 'Message' } & Pick<Message, 'id' | 'component' | 'text'>
  >;
};

export type NewChatMessagesSubscriptionVariables = Exact<{
  [key: string]: never;
}>;

export type NewChatMessagesSubscription = { __typename?: 'Subscription' } & {
  newMessages: Array<
    Maybe<
      { __typename?: 'Message' } & Pick<Message, 'id' | 'component' | 'text'>
    >
  >;
};

export type LoginMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = { __typename?: 'Mutation' } & {
  login?: Maybe<{ __typename?: 'AuthInfo' } & Pick<AuthInfo, 'token'>>;
};

export type SignUpMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;

export type SignUpMutation = { __typename?: 'Mutation' } & {
  signUp?: Maybe<{ __typename?: 'AuthInfo' } & Pick<AuthInfo, 'token'>>;
};

export const ChatMessagesDocument = gql`
  query ChatMessages {
    world(id: "cknvk4vzp0000t106p579o0xm") {
      messages {
        id
        component
        text
      }
    }
  }
`;

export function useChatMessagesQuery(
  options: Omit<Urql.UseQueryArgs<ChatMessagesQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<ChatMessagesQuery>({
    query: ChatMessagesDocument,
    ...options,
  });
}
export const SendMessageDocument = gql`
  mutation SendMessage($text: String, $component: String) {
    sendMessage(
      worldId: "cknvk4vzp0000t106p579o0xm"
      input: { text: $text, component: $component }
    ) {
      id
      component
      text
    }
  }
`;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(
    SendMessageDocument,
  );
}
export const NewChatMessagesDocument = gql`
  subscription NewChatMessages {
    newMessages(worldId: "cknvk4vzp0000t106p579o0xm") {
      id
      component
      text
    }
  }
`;

export function useNewChatMessagesSubscription<
  TData = NewChatMessagesSubscription
>(
  options: Omit<
    Urql.UseSubscriptionArgs<NewChatMessagesSubscriptionVariables>,
    'query'
  > = {},
  handler?: Urql.SubscriptionHandler<NewChatMessagesSubscription, TData>,
) {
  return Urql.useSubscription<
    NewChatMessagesSubscription,
    TData,
    NewChatMessagesSubscriptionVariables
  >({ query: NewChatMessagesDocument, ...options }, handler);
}
export const LoginDocument = gql`
  mutation Login($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      token
    }
  }
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const SignUpDocument = gql`
  mutation SignUp($name: String!, $password: String!) {
    signUp(name: $name, password: $password) {
      token
    }
  }
`;

export function useSignUpMutation() {
  return Urql.useMutation<SignUpMutation, SignUpMutationVariables>(
    SignUpDocument,
  );
}
