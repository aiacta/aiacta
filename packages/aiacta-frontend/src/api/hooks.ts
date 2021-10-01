import * as Urql from 'urql';
import { gql } from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Blob: any;
  DateTime: any;
  Upload: any;
};

export type AuthInfo = {
  __typename?: 'AuthInfo';
  player: Player;
  token: Scalars['String'];
};

export type DiceRoll = {
  __typename?: 'DiceRoll';
  dice: Array<Die>;
  id: Scalars['ID'];
  roller: PlayerInWorld;
};

export type DiceRollContext = {
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
};

export type DiceRollInput = {
  context?: Maybe<DiceRollContext>;
  formula: Scalars['String'];
  visibility?: Maybe<DiceRollVisibility>;
};

export enum DiceRollVisibility {
  Everybody = 'EVERYBODY',
  GmOnly = 'GM_ONLY',
  MyselfOnly = 'MYSELF_ONLY',
}

export type Die = {
  __typename?: 'Die';
  id: Scalars['ID'];
  type: DieType;
  value: Scalars['Int'];
};

export enum DieType {
  D4 = 'D4',
  D6 = 'D6',
  D8 = 'D8',
  D10 = 'D10',
  D12 = 'D12',
  D20 = 'D20',
}

export type GridSettings = {
  __typename?: 'GridSettings';
  offset: Point;
  size?: Maybe<Scalars['Int']>;
};

export type GridSettingsInput = {
  offset: PointInput;
  size?: Maybe<Scalars['Int']>;
};

export type Light = {
  __typename?: 'Light';
  position: Point;
};

export type LightInput = {
  position: PointInput;
};

export type Message = {
  __typename?: 'Message';
  author: PlayerInfo;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  rolls?: Maybe<Array<Maybe<Scalars['ID']>>>;
  text?: Maybe<Scalars['String']>;
};

export type MessageInput = {
  text?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createScene?: Maybe<Scene>;
  createWorld?: Maybe<World>;
  joinWorld?: Maybe<World>;
  login?: Maybe<AuthInfo>;
  rollDice?: Maybe<DiceRoll>;
  sendMessage?: Maybe<Message>;
  signUp?: Maybe<AuthInfo>;
};

export type MutationCreateSceneArgs = {
  input: SceneInput;
};

export type MutationCreateWorldArgs = {
  input: WorldInput;
};

export type MutationJoinWorldArgs = {
  joinKey?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  worldId: Scalars['ID'];
};

export type MutationLoginArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type MutationRollDiceArgs = {
  input: DiceRollInput;
  worldId: Scalars['ID'];
};

export type MutationSendMessageArgs = {
  input: MessageInput;
  worldId: Scalars['ID'];
};

export type MutationSignUpArgs = {
  color?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Player = PlayerInfo & {
  __typename?: 'Player';
  color: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  worlds?: Maybe<Array<Maybe<World>>>;
};

export type PlayerInWorld = PlayerInfo & {
  __typename?: 'PlayerInWorld';
  color: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  role: Role;
};

export type PlayerInfo = {
  color: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Point = {
  __typename?: 'Point';
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type PointInput = {
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  invitesToWorlds?: Maybe<Array<Maybe<World>>>;
  me?: Maybe<Player>;
  v?: Maybe<Scalars['Int']>;
  world?: Maybe<World>;
  worlds?: Maybe<Array<Maybe<World>>>;
};

export type QueryWorldArgs = {
  id: Scalars['ID'];
};

export enum Role {
  Gamemaster = 'GAMEMASTER',
  User = 'USER',
}

export type Scene = {
  __typename?: 'Scene';
  grid?: Maybe<GridSettings>;
  height: Scalars['Int'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['Blob']>;
  lights?: Maybe<Array<Maybe<Light>>>;
  name: Scalars['String'];
  walls?: Maybe<Array<Maybe<Wall>>>;
  width: Scalars['Int'];
  world: World;
};

export type SceneInput = {
  grid?: Maybe<GridSettingsInput>;
  height: Scalars['Int'];
  image?: Maybe<Scalars['Upload']>;
  lights?: Maybe<Array<Maybe<LightInput>>>;
  name: Scalars['String'];
  walls?: Maybe<Array<Maybe<WallInput>>>;
  width: Scalars['Int'];
  worldId: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  diceRolls: Array<Maybe<DiceRoll>>;
  newMessages: Array<Maybe<Message>>;
};

export type SubscriptionDiceRollsArgs = {
  worldId: Scalars['ID'];
};

export type SubscriptionNewMessagesArgs = {
  worldId: Scalars['ID'];
};

export type Wall = {
  __typename?: 'Wall';
  points: Array<Point>;
};

export type WallInput = {
  points: Array<PointInput>;
};

export type World = {
  __typename?: 'World';
  creator?: Maybe<PlayerInWorld>;
  id: Scalars['ID'];
  isListed: Scalars['Boolean'];
  isPasswordProtected: Scalars['Boolean'];
  me?: Maybe<PlayerInWorld>;
  messages?: Maybe<Array<Maybe<Message>>>;
  name: Scalars['String'];
  players?: Maybe<Array<Maybe<PlayerInWorld>>>;
  scene?: Maybe<Scene>;
  scenes?: Maybe<Array<Maybe<Scene>>>;
};

export type WorldSceneArgs = {
  id: Scalars['ID'];
};

export type WorldInput = {
  inviteOnly: Scalars['Boolean'];
  name: Scalars['String'];
  password?: Maybe<Scalars['String']>;
};

export type MessageDataFragment = {
  __typename?: 'Message';
  id: string;
  text?: string | null | undefined;
  createdAt: any;
  rolls?: Array<string | null | undefined> | null | undefined;
  author:
    | { __typename?: 'Player'; id: string; name: string; color: string }
    | { __typename?: 'PlayerInWorld'; id: string; name: string; color: string };
};

export type ChatMessagesQueryVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type ChatMessagesQuery = {
  __typename?: 'Query';
  world?:
    | {
        __typename?: 'World';
        id: string;
        messages?:
          | Array<
              | {
                  __typename?: 'Message';
                  id: string;
                  text?: string | null | undefined;
                  createdAt: any;
                  rolls?: Array<string | null | undefined> | null | undefined;
                  author:
                    | {
                        __typename?: 'Player';
                        id: string;
                        name: string;
                        color: string;
                      }
                    | {
                        __typename?: 'PlayerInWorld';
                        id: string;
                        name: string;
                        color: string;
                      };
                }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type SendMessageMutationVariables = Exact<{
  worldId: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
}>;

export type SendMessageMutation = {
  __typename?: 'Mutation';
  sendMessage?:
    | {
        __typename?: 'Message';
        id: string;
        text?: string | null | undefined;
        createdAt: any;
        rolls?: Array<string | null | undefined> | null | undefined;
        author:
          | { __typename?: 'Player'; id: string; name: string; color: string }
          | {
              __typename?: 'PlayerInWorld';
              id: string;
              name: string;
              color: string;
            };
      }
    | null
    | undefined;
};

export type NewChatMessagesSubscriptionVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type NewChatMessagesSubscription = {
  __typename?: 'Subscription';
  newMessages: Array<
    | {
        __typename?: 'Message';
        id: string;
        text?: string | null | undefined;
        createdAt: any;
        rolls?: Array<string | null | undefined> | null | undefined;
        author:
          | { __typename?: 'Player'; id: string; name: string; color: string }
          | {
              __typename?: 'PlayerInWorld';
              id: string;
              name: string;
              color: string;
            };
      }
    | null
    | undefined
  >;
};

export type RollDiceMutationVariables = Exact<{
  worldId: Scalars['ID'];
  formula: Scalars['String'];
}>;

export type RollDiceMutation = {
  __typename?: 'Mutation';
  rollDice?:
    | {
        __typename?: 'DiceRoll';
        id: string;
        dice: Array<{
          __typename?: 'Die';
          id: string;
          type: DieType;
          value: number;
        }>;
      }
    | null
    | undefined;
};

export type DiceRollsSubscriptionVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type DiceRollsSubscription = {
  __typename?: 'Subscription';
  diceRolls: Array<
    | {
        __typename?: 'DiceRoll';
        id: string;
        roller: {
          __typename?: 'PlayerInWorld';
          id: string;
          name: string;
          color: string;
        };
        dice: Array<{
          __typename?: 'Die';
          id: string;
          type: DieType;
          value: number;
        }>;
      }
    | null
    | undefined
  >;
};

export type LoginMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
}>;

export type LoginMutation = {
  __typename?: 'Mutation';
  login?: { __typename?: 'AuthInfo'; token: string } | null | undefined;
};

export type SignUpMutationVariables = Exact<{
  name: Scalars['String'];
  password: Scalars['String'];
  color?: Maybe<Scalars['String']>;
}>;

export type SignUpMutation = {
  __typename?: 'Mutation';
  signUp?: { __typename?: 'AuthInfo'; token: string } | null | undefined;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: 'Query';
  me?:
    | { __typename?: 'Player'; id: string; name: string; color: string }
    | null
    | undefined;
};

export type MeInWorldQueryVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type MeInWorldQuery = {
  __typename?: 'Query';
  world?:
    | {
        __typename?: 'World';
        id: string;
        me?:
          | { __typename?: 'PlayerInWorld'; id: string; role: Role }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type ListInfoSceneFragment = {
  __typename?: 'Scene';
  id: string;
  name: string;
};

export type DetailsSceneFragment = {
  __typename?: 'Scene';
  image?: any | null | undefined;
  width: number;
  height: number;
  id: string;
  name: string;
  grid?:
    | {
        __typename?: 'GridSettings';
        size?: number | null | undefined;
        offset: { __typename?: 'Point'; x: number; y: number };
      }
    | null
    | undefined;
  walls?:
    | Array<
        | {
            __typename?: 'Wall';
            points: Array<{ __typename?: 'Point'; x: number; y: number }>;
          }
        | null
        | undefined
      >
    | null
    | undefined;
  lights?:
    | Array<
        | {
            __typename?: 'Light';
            position: { __typename?: 'Point'; x: number; y: number };
          }
        | null
        | undefined
      >
    | null
    | undefined;
};

export type CreateSceneMutationVariables = Exact<{
  worldId: Scalars['ID'];
  name: Scalars['String'];
  width: Scalars['Int'];
  height: Scalars['Int'];
  grid?: Maybe<GridSettingsInput>;
  walls?: Maybe<Array<Maybe<WallInput>> | Maybe<WallInput>>;
  lights?: Maybe<Array<Maybe<LightInput>> | Maybe<LightInput>>;
  image?: Maybe<Scalars['Upload']>;
}>;

export type CreateSceneMutation = {
  __typename?: 'Mutation';
  createScene?:
    | { __typename?: 'Scene'; id: string; name: string }
    | null
    | undefined;
};

export type ListScenesQueryVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type ListScenesQuery = {
  __typename?: 'Query';
  world?:
    | {
        __typename?: 'World';
        id: string;
        scenes?:
          | Array<
              | { __typename?: 'Scene'; id: string; name: string }
              | null
              | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type SceneDetailsQueryVariables = Exact<{
  worldId: Scalars['ID'];
  sceneId: Scalars['ID'];
}>;

export type SceneDetailsQuery = {
  __typename?: 'Query';
  world?:
    | {
        __typename?: 'World';
        id: string;
        scene?:
          | {
              __typename?: 'Scene';
              image?: any | null | undefined;
              width: number;
              height: number;
              id: string;
              name: string;
              grid?:
                | {
                    __typename?: 'GridSettings';
                    size?: number | null | undefined;
                    offset: { __typename?: 'Point'; x: number; y: number };
                  }
                | null
                | undefined;
              walls?:
                | Array<
                    | {
                        __typename?: 'Wall';
                        points: Array<{
                          __typename?: 'Point';
                          x: number;
                          y: number;
                        }>;
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
              lights?:
                | Array<
                    | {
                        __typename?: 'Light';
                        position: {
                          __typename?: 'Point';
                          x: number;
                          y: number;
                        };
                      }
                    | null
                    | undefined
                  >
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type ListInfoWorldFragment = {
  __typename?: 'World';
  id: string;
  name: string;
  isListed: boolean;
  isPasswordProtected: boolean;
  creator?:
    | { __typename?: 'PlayerInWorld'; id: string; name: string }
    | null
    | undefined;
  players?:
    | Array<{ __typename?: 'PlayerInWorld'; id: string } | null | undefined>
    | null
    | undefined;
};

export type AvailableWorldsQueryVariables = Exact<{ [key: string]: never }>;

export type AvailableWorldsQuery = {
  __typename?: 'Query';
  worlds?:
    | Array<
        | {
            __typename?: 'World';
            id: string;
            name: string;
            isListed: boolean;
            isPasswordProtected: boolean;
            creator?:
              | { __typename?: 'PlayerInWorld'; id: string; name: string }
              | null
              | undefined;
            players?:
              | Array<
                  | { __typename?: 'PlayerInWorld'; id: string }
                  | null
                  | undefined
                >
              | null
              | undefined;
          }
        | null
        | undefined
      >
    | null
    | undefined;
};

export type WorldToJoinQueryVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type WorldToJoinQuery = {
  __typename?: 'Query';
  world?:
    | { __typename?: 'World'; isPasswordProtected: boolean }
    | null
    | undefined;
};

export type CreateWorldMutationVariables = Exact<{
  name: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  inviteOnly: Scalars['Boolean'];
}>;

export type CreateWorldMutation = {
  __typename?: 'Mutation';
  createWorld?:
    | {
        __typename?: 'World';
        id: string;
        name: string;
        isListed: boolean;
        isPasswordProtected: boolean;
        creator?:
          | { __typename?: 'PlayerInWorld'; id: string; name: string }
          | null
          | undefined;
        players?:
          | Array<
              { __typename?: 'PlayerInWorld'; id: string } | null | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export type JoinWorldMutationVariables = Exact<{
  worldId: Scalars['ID'];
  password?: Maybe<Scalars['String']>;
  joinKey?: Maybe<Scalars['String']>;
}>;

export type JoinWorldMutation = {
  __typename?: 'Mutation';
  joinWorld?:
    | {
        __typename?: 'World';
        id: string;
        players?:
          | Array<
              { __typename?: 'PlayerInWorld'; id: string } | null | undefined
            >
          | null
          | undefined;
      }
    | null
    | undefined;
};

export const MessageDataFragmentDoc = gql`
  fragment MessageData on Message {
    id
    text
    author {
      id
      name
      color
    }
    createdAt
    rolls
  }
`;
export const ListInfoSceneFragmentDoc = gql`
  fragment ListInfoScene on Scene {
    id
    name
  }
`;
export const DetailsSceneFragmentDoc = gql`
  fragment DetailsScene on Scene {
    ...ListInfoScene
    image
    width
    height
    grid {
      size
      offset {
        x
        y
      }
    }
    walls {
      points {
        x
        y
      }
    }
    lights {
      position {
        x
        y
      }
    }
  }
  ${ListInfoSceneFragmentDoc}
`;
export const ListInfoWorldFragmentDoc = gql`
  fragment ListInfoWorld on World {
    id
    name
    creator {
      id
      name
    }
    players {
      id
    }
    isListed
    isPasswordProtected
  }
`;
export const ChatMessagesDocument = gql`
  query ChatMessages($worldId: ID!) {
    world(id: $worldId) {
      id
      messages {
        ...MessageData
      }
    }
  }
  ${MessageDataFragmentDoc}
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
  mutation SendMessage($worldId: ID!, $text: String) {
    sendMessage(worldId: $worldId, input: { text: $text }) {
      ...MessageData
    }
  }
  ${MessageDataFragmentDoc}
`;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(
    SendMessageDocument,
  );
}
export const NewChatMessagesDocument = gql`
  subscription NewChatMessages($worldId: ID!) {
    newMessages(worldId: $worldId) {
      ...MessageData
    }
  }
  ${MessageDataFragmentDoc}
`;

export function useNewChatMessagesSubscription<
  TData = NewChatMessagesSubscription,
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
export const RollDiceDocument = gql`
  mutation RollDice($worldId: ID!, $formula: String!) {
    rollDice(worldId: $worldId, input: { formula: $formula }) {
      id
      dice {
        id
        type
        value
      }
    }
  }
`;

export function useRollDiceMutation() {
  return Urql.useMutation<RollDiceMutation, RollDiceMutationVariables>(
    RollDiceDocument,
  );
}
export const DiceRollsDocument = gql`
  subscription DiceRolls($worldId: ID!) {
    diceRolls(worldId: $worldId) {
      id
      roller {
        id
        name
        color
      }
      dice {
        id
        type
        value
      }
    }
  }
`;

export function useDiceRollsSubscription<TData = DiceRollsSubscription>(
  options: Omit<
    Urql.UseSubscriptionArgs<DiceRollsSubscriptionVariables>,
    'query'
  > = {},
  handler?: Urql.SubscriptionHandler<DiceRollsSubscription, TData>,
) {
  return Urql.useSubscription<
    DiceRollsSubscription,
    TData,
    DiceRollsSubscriptionVariables
  >({ query: DiceRollsDocument, ...options }, handler);
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
  mutation SignUp($name: String!, $password: String!, $color: String) {
    signUp(name: $name, password: $password, color: $color) {
      token
    }
  }
`;

export function useSignUpMutation() {
  return Urql.useMutation<SignUpMutation, SignUpMutationVariables>(
    SignUpDocument,
  );
}
export const MeDocument = gql`
  query Me {
    me {
      id
      name
      color
    }
  }
`;

export function useMeQuery(
  options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
}
export const MeInWorldDocument = gql`
  query MeInWorld($worldId: ID!) {
    world(id: $worldId) {
      id
      me {
        id
        role
      }
    }
  }
`;

export function useMeInWorldQuery(
  options: Omit<Urql.UseQueryArgs<MeInWorldQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<MeInWorldQuery>({
    query: MeInWorldDocument,
    ...options,
  });
}
export const CreateSceneDocument = gql`
  mutation CreateScene(
    $worldId: ID!
    $name: String!
    $width: Int!
    $height: Int!
    $grid: GridSettingsInput
    $walls: [WallInput]
    $lights: [LightInput]
    $image: Upload
  ) {
    createScene(
      input: {
        worldId: $worldId
        name: $name
        width: $width
        height: $height
        grid: $grid
        walls: $walls
        lights: $lights
        image: $image
      }
    ) {
      ...ListInfoScene
    }
  }
  ${ListInfoSceneFragmentDoc}
`;

export function useCreateSceneMutation() {
  return Urql.useMutation<CreateSceneMutation, CreateSceneMutationVariables>(
    CreateSceneDocument,
  );
}
export const ListScenesDocument = gql`
  query ListScenes($worldId: ID!) {
    world(id: $worldId) {
      id
      scenes {
        ...ListInfoScene
      }
    }
  }
  ${ListInfoSceneFragmentDoc}
`;

export function useListScenesQuery(
  options: Omit<Urql.UseQueryArgs<ListScenesQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<ListScenesQuery>({
    query: ListScenesDocument,
    ...options,
  });
}
export const SceneDetailsDocument = gql`
  query SceneDetails($worldId: ID!, $sceneId: ID!) {
    world(id: $worldId) {
      id
      scene(id: $sceneId) {
        ...DetailsScene
      }
    }
  }
  ${DetailsSceneFragmentDoc}
`;

export function useSceneDetailsQuery(
  options: Omit<Urql.UseQueryArgs<SceneDetailsQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<SceneDetailsQuery>({
    query: SceneDetailsDocument,
    ...options,
  });
}
export const AvailableWorldsDocument = gql`
  query AvailableWorlds {
    worlds {
      ...ListInfoWorld
    }
  }
  ${ListInfoWorldFragmentDoc}
`;

export function useAvailableWorldsQuery(
  options: Omit<Urql.UseQueryArgs<AvailableWorldsQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<AvailableWorldsQuery>({
    query: AvailableWorldsDocument,
    ...options,
  });
}
export const WorldToJoinDocument = gql`
  query WorldToJoin($worldId: ID!) {
    world(id: $worldId) {
      isPasswordProtected
    }
  }
`;

export function useWorldToJoinQuery(
  options: Omit<Urql.UseQueryArgs<WorldToJoinQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<WorldToJoinQuery>({
    query: WorldToJoinDocument,
    ...options,
  });
}
export const CreateWorldDocument = gql`
  mutation CreateWorld(
    $name: String!
    $password: String
    $inviteOnly: Boolean!
  ) {
    createWorld(
      input: { name: $name, password: $password, inviteOnly: $inviteOnly }
    ) {
      ...ListInfoWorld
    }
  }
  ${ListInfoWorldFragmentDoc}
`;

export function useCreateWorldMutation() {
  return Urql.useMutation<CreateWorldMutation, CreateWorldMutationVariables>(
    CreateWorldDocument,
  );
}
export const JoinWorldDocument = gql`
  mutation JoinWorld($worldId: ID!, $password: String, $joinKey: String) {
    joinWorld(worldId: $worldId, password: $password, joinKey: $joinKey) {
      id
      players {
        id
      }
    }
  }
`;

export function useJoinWorldMutation() {
  return Urql.useMutation<JoinWorldMutation, JoinWorldMutationVariables>(
    JoinWorldDocument,
  );
}
