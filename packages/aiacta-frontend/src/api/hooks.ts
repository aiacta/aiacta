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
  Blob: any;
  DateTime: any;
  Upload: any;
};

export type AuthInfo = {
  __typename?: 'AuthInfo';
  token: Scalars['String'];
  player: Player;
};

export type DiceRoll = {
  __typename?: 'DiceRoll';
  id: Scalars['ID'];
  roller: PlayerInWorld;
  dice: Array<Die>;
};

export type DiceRollContext = {
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['String']>;
};

export type DiceRollInput = {
  formula: Scalars['String'];
  context?: Maybe<DiceRollContext>;
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
  size?: Maybe<Scalars['Int']>;
  offset: Point;
};

export type GridSettingsInput = {
  size?: Maybe<Scalars['Int']>;
  offset: PointInput;
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
  id: Scalars['ID'];
  author: PlayerInfo;
  createdAt: Scalars['DateTime'];
  component?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  rolls?: Maybe<Array<Maybe<Scalars['ID']>>>;
};

export type MessageInput = {
  component?: Maybe<Scalars['String']>;
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
  worldId: Scalars['ID'];
  password?: Maybe<Scalars['String']>;
  joinKey?: Maybe<Scalars['String']>;
};

export type MutationLoginArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type MutationRollDiceArgs = {
  worldId: Scalars['ID'];
  input: DiceRollInput;
};

export type MutationSendMessageArgs = {
  worldId: Scalars['ID'];
  input: MessageInput;
};

export type MutationSignUpArgs = {
  name: Scalars['String'];
  password: Scalars['String'];
  color?: Maybe<Scalars['String']>;
};

export type Player = PlayerInfo & {
  __typename?: 'Player';
  id: Scalars['ID'];
  name: Scalars['String'];
  color: Scalars['String'];
  worlds?: Maybe<Array<Maybe<World>>>;
};

export type PlayerInWorld = PlayerInfo & {
  __typename?: 'PlayerInWorld';
  id: Scalars['ID'];
  name: Scalars['String'];
  color: Scalars['String'];
  role: Role;
};

export type PlayerInfo = {
  id: Scalars['ID'];
  name: Scalars['String'];
  color: Scalars['String'];
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
  id: Scalars['ID'];
  world: World;
  name: Scalars['String'];
  walls?: Maybe<Array<Maybe<Wall>>>;
  lights?: Maybe<Array<Maybe<Light>>>;
  image?: Maybe<Scalars['Blob']>;
  width: Scalars['Int'];
  height: Scalars['Int'];
  grid?: Maybe<GridSettings>;
};

export type SceneInput = {
  worldId: Scalars['ID'];
  name: Scalars['String'];
  walls?: Maybe<Array<Maybe<WallInput>>>;
  lights?: Maybe<Array<Maybe<LightInput>>>;
  image?: Maybe<Scalars['Upload']>;
  width: Scalars['Int'];
  height: Scalars['Int'];
  grid?: Maybe<GridSettingsInput>;
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
  name: Scalars['String'];
  inviteOnly: Scalars['Boolean'];
  password?: Maybe<Scalars['String']>;
};

export type MessageDataFragment = { __typename?: 'Message' } & Pick<
  Message,
  'id' | 'component' | 'text' | 'createdAt' | 'rolls'
> & {
    author:
      | ({ __typename?: 'Player' } & Pick<Player, 'id' | 'name' | 'color'>)
      | ({ __typename?: 'PlayerInWorld' } & Pick<
          PlayerInWorld,
          'id' | 'name' | 'color'
        >);
  };

export type ChatMessagesQueryVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type ChatMessagesQuery = { __typename?: 'Query' } & {
  world?: Maybe<
    { __typename?: 'World' } & Pick<World, 'id'> & {
        messages?: Maybe<
          Array<Maybe<{ __typename?: 'Message' } & MessageDataFragment>>
        >;
      }
  >;
};

export type SendMessageMutationVariables = Exact<{
  worldId: Scalars['ID'];
  text?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
}>;

export type SendMessageMutation = { __typename?: 'Mutation' } & {
  sendMessage?: Maybe<{ __typename?: 'Message' } & MessageDataFragment>;
};

export type NewChatMessagesSubscriptionVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type NewChatMessagesSubscription = { __typename?: 'Subscription' } & {
  newMessages: Array<Maybe<{ __typename?: 'Message' } & MessageDataFragment>>;
};

export type RollDiceMutationVariables = Exact<{
  worldId: Scalars['ID'];
  formula: Scalars['String'];
}>;

export type RollDiceMutation = { __typename?: 'Mutation' } & {
  rollDice?: Maybe<
    { __typename?: 'DiceRoll' } & Pick<DiceRoll, 'id'> & {
        dice: Array<
          { __typename?: 'Die' } & Pick<Die, 'id' | 'type' | 'value'>
        >;
      }
  >;
};

export type DiceRollsSubscriptionVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type DiceRollsSubscription = { __typename?: 'Subscription' } & {
  diceRolls: Array<
    Maybe<
      { __typename?: 'DiceRoll' } & Pick<DiceRoll, 'id'> & {
          roller: { __typename?: 'PlayerInWorld' } & Pick<
            PlayerInWorld,
            'id' | 'name' | 'color'
          >;
          dice: Array<
            { __typename?: 'Die' } & Pick<Die, 'id' | 'type' | 'value'>
          >;
        }
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
  color?: Maybe<Scalars['String']>;
}>;

export type SignUpMutation = { __typename?: 'Mutation' } & {
  signUp?: Maybe<{ __typename?: 'AuthInfo' } & Pick<AuthInfo, 'token'>>;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: 'Query' } & {
  me?: Maybe<{ __typename?: 'Player' } & Pick<Player, 'id' | 'name' | 'color'>>;
};

export type ListInfoSceneFragment = { __typename?: 'Scene' } & Pick<
  Scene,
  'id' | 'name'
>;

export type DetailsSceneFragment = { __typename?: 'Scene' } & Pick<
  Scene,
  'image' | 'width' | 'height'
> & {
    grid?: Maybe<
      { __typename?: 'GridSettings' } & Pick<GridSettings, 'size'> & {
          offset: { __typename?: 'Point' } & Pick<Point, 'x' | 'y'>;
        }
    >;
    walls?: Maybe<
      Array<
        Maybe<
          { __typename?: 'Wall' } & {
            points: Array<{ __typename?: 'Point' } & Pick<Point, 'x' | 'y'>>;
          }
        >
      >
    >;
    lights?: Maybe<
      Array<
        Maybe<
          { __typename?: 'Light' } & {
            position: { __typename?: 'Point' } & Pick<Point, 'x' | 'y'>;
          }
        >
      >
    >;
  } & ListInfoSceneFragment;

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

export type CreateSceneMutation = { __typename?: 'Mutation' } & {
  createScene?: Maybe<{ __typename?: 'Scene' } & ListInfoSceneFragment>;
};

export type ListScenesQueryVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type ListScenesQuery = { __typename?: 'Query' } & {
  world?: Maybe<
    { __typename?: 'World' } & Pick<World, 'id'> & {
        scenes?: Maybe<
          Array<Maybe<{ __typename?: 'Scene' } & ListInfoSceneFragment>>
        >;
      }
  >;
};

export type SceneDetailsQueryVariables = Exact<{
  worldId: Scalars['ID'];
  sceneId: Scalars['ID'];
}>;

export type SceneDetailsQuery = { __typename?: 'Query' } & {
  world?: Maybe<
    { __typename?: 'World' } & Pick<World, 'id'> & {
        scene?: Maybe<{ __typename?: 'Scene' } & DetailsSceneFragment>;
      }
  >;
};

export type ListInfoWorldFragment = { __typename?: 'World' } & Pick<
  World,
  'id' | 'name' | 'isListed' | 'isPasswordProtected'
> & {
    creator?: Maybe<
      { __typename?: 'PlayerInWorld' } & Pick<PlayerInWorld, 'id' | 'name'>
    >;
    players?: Maybe<
      Array<Maybe<{ __typename?: 'PlayerInWorld' } & Pick<PlayerInWorld, 'id'>>>
    >;
  };

export type AvailableWorldsQueryVariables = Exact<{ [key: string]: never }>;

export type AvailableWorldsQuery = { __typename?: 'Query' } & {
  worlds?: Maybe<
    Array<Maybe<{ __typename?: 'World' } & ListInfoWorldFragment>>
  >;
};

export type WorldToJoinQueryVariables = Exact<{
  worldId: Scalars['ID'];
}>;

export type WorldToJoinQuery = { __typename?: 'Query' } & {
  world?: Maybe<{ __typename?: 'World' } & Pick<World, 'isPasswordProtected'>>;
};

export type CreateWorldMutationVariables = Exact<{
  name: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  inviteOnly: Scalars['Boolean'];
}>;

export type CreateWorldMutation = { __typename?: 'Mutation' } & {
  createWorld?: Maybe<{ __typename?: 'World' } & ListInfoWorldFragment>;
};

export type JoinWorldMutationVariables = Exact<{
  worldId: Scalars['ID'];
  password?: Maybe<Scalars['String']>;
  joinKey?: Maybe<Scalars['String']>;
}>;

export type JoinWorldMutation = { __typename?: 'Mutation' } & {
  joinWorld?: Maybe<
    { __typename?: 'World' } & Pick<World, 'id'> & {
        players?: Maybe<
          Array<
            Maybe<{ __typename?: 'PlayerInWorld' } & Pick<PlayerInWorld, 'id'>>
          >
        >;
      }
  >;
};

export const MessageDataFragmentDoc = gql`
  fragment MessageData on Message {
    id
    component
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
  mutation SendMessage($worldId: ID!, $text: String, $component: String) {
    sendMessage(
      worldId: $worldId
      input: { text: $text, component: $component }
    ) {
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
