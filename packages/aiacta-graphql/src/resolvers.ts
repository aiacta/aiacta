/* eslint-disable */
import { Role } from '@aiacta/prisma';
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import { World as WorldModel } from '@aiacta/prisma';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = {
  [key in keyof T]?: AllowedValues;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Blob: any;
  DateTime: any;
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

export { Role };

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
  image?: Maybe<Scalars['Blob']>;
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
  scenes?: Maybe<Array<Maybe<Scene>>>;
};

export type WorldInput = {
  name: Scalars['String'];
  inviteOnly: Scalars['Boolean'];
  password?: Maybe<Scalars['String']>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {},
> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthInfo: ResolverTypeWrapper<
    Partial<Omit<AuthInfo, 'player'> & { player: ResolversTypes['Player'] }>
  >;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Blob: ResolverTypeWrapper<Partial<Scalars['Blob']>>;
  DateTime: ResolverTypeWrapper<Partial<Scalars['DateTime']>>;
  DiceRoll: ResolverTypeWrapper<Partial<DiceRoll>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  DiceRollContext: ResolverTypeWrapper<Partial<DiceRollContext>>;
  DiceRollInput: ResolverTypeWrapper<Partial<DiceRollInput>>;
  DiceRollVisibility: ResolverTypeWrapper<Partial<DiceRollVisibility>>;
  Die: ResolverTypeWrapper<Partial<Die>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  DieType: ResolverTypeWrapper<Partial<DieType>>;
  GridSettings: ResolverTypeWrapper<Partial<GridSettings>>;
  GridSettingsInput: ResolverTypeWrapper<Partial<GridSettingsInput>>;
  Light: ResolverTypeWrapper<Partial<Light>>;
  LightInput: ResolverTypeWrapper<Partial<LightInput>>;
  Message: ResolverTypeWrapper<Partial<Message>>;
  MessageInput: ResolverTypeWrapper<Partial<MessageInput>>;
  Mutation: ResolverTypeWrapper<{}>;
  Player: ResolverTypeWrapper<
    Partial<
      Omit<Player, 'worlds'> & {
        worlds?: Maybe<Array<Maybe<ResolversTypes['World']>>>;
      }
    >
  >;
  PlayerInWorld: ResolverTypeWrapper<Partial<PlayerInWorld>>;
  PlayerInfo: ResolversTypes['Player'] | ResolversTypes['PlayerInWorld'];
  Point: ResolverTypeWrapper<Partial<Point>>;
  PointInput: ResolverTypeWrapper<Partial<PointInput>>;
  Query: ResolverTypeWrapper<{}>;
  Role: ResolverTypeWrapper<Partial<Role>>;
  Scene: ResolverTypeWrapper<
    Partial<Omit<Scene, 'world'> & { world: ResolversTypes['World'] }>
  >;
  SceneInput: ResolverTypeWrapper<Partial<SceneInput>>;
  Subscription: ResolverTypeWrapper<{}>;
  Wall: ResolverTypeWrapper<Partial<Wall>>;
  WallInput: ResolverTypeWrapper<Partial<WallInput>>;
  World: ResolverTypeWrapper<WorldModel>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  WorldInput: ResolverTypeWrapper<Partial<WorldInput>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthInfo: Partial<
    Omit<AuthInfo, 'player'> & { player: ResolversParentTypes['Player'] }
  >;
  String: Partial<Scalars['String']>;
  Blob: Partial<Scalars['Blob']>;
  DateTime: Partial<Scalars['DateTime']>;
  DiceRoll: Partial<DiceRoll>;
  ID: Partial<Scalars['ID']>;
  DiceRollContext: Partial<DiceRollContext>;
  DiceRollInput: Partial<DiceRollInput>;
  Die: Partial<Die>;
  Int: Partial<Scalars['Int']>;
  GridSettings: Partial<GridSettings>;
  GridSettingsInput: Partial<GridSettingsInput>;
  Light: Partial<Light>;
  LightInput: Partial<LightInput>;
  Message: Partial<Message>;
  MessageInput: Partial<MessageInput>;
  Mutation: {};
  Player: Partial<
    Omit<Player, 'worlds'> & {
      worlds?: Maybe<Array<Maybe<ResolversParentTypes['World']>>>;
    }
  >;
  PlayerInWorld: Partial<PlayerInWorld>;
  PlayerInfo:
    | ResolversParentTypes['Player']
    | ResolversParentTypes['PlayerInWorld'];
  Point: Partial<Point>;
  PointInput: Partial<PointInput>;
  Query: {};
  Scene: Partial<
    Omit<Scene, 'world'> & { world: ResolversParentTypes['World'] }
  >;
  SceneInput: Partial<SceneInput>;
  Subscription: {};
  Wall: Partial<Wall>;
  WallInput: Partial<WallInput>;
  World: WorldModel;
  Boolean: Partial<Scalars['Boolean']>;
  WorldInput: Partial<WorldInput>;
};

export type AuthInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthInfo'] = ResolversParentTypes['AuthInfo'],
> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BlobScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Blob'], any> {
  name: 'Blob';
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DiceRollResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DiceRoll'] = ResolversParentTypes['DiceRoll'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roller?: Resolver<ResolversTypes['PlayerInWorld'], ParentType, ContextType>;
  dice?: Resolver<Array<ResolversTypes['Die']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DieResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Die'] = ResolversParentTypes['Die'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DieType'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GridSettingsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GridSettings'] = ResolversParentTypes['GridSettings'],
> = {
  size?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Point'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LightResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Light'] = ResolversParentTypes['Light'],
> = {
  position?: Resolver<ResolversTypes['Point'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['PlayerInfo'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  component?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rolls?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['ID']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  createScene?: Resolver<
    Maybe<ResolversTypes['Scene']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateSceneArgs, 'input'>
  >;
  createWorld?: Resolver<
    Maybe<ResolversTypes['World']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateWorldArgs, 'input'>
  >;
  joinWorld?: Resolver<
    Maybe<ResolversTypes['World']>,
    ParentType,
    ContextType,
    RequireFields<MutationJoinWorldArgs, 'worldId'>
  >;
  login?: Resolver<
    Maybe<ResolversTypes['AuthInfo']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'name' | 'password'>
  >;
  rollDice?: Resolver<
    Maybe<ResolversTypes['DiceRoll']>,
    ParentType,
    ContextType,
    RequireFields<MutationRollDiceArgs, 'worldId' | 'input'>
  >;
  sendMessage?: Resolver<
    Maybe<ResolversTypes['Message']>,
    ParentType,
    ContextType,
    RequireFields<MutationSendMessageArgs, 'worldId' | 'input'>
  >;
  signUp?: Resolver<
    Maybe<ResolversTypes['AuthInfo']>,
    ParentType,
    ContextType,
    RequireFields<MutationSignUpArgs, 'name' | 'password'>
  >;
};

export type PlayerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  worlds?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['World']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerInWorldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PlayerInWorld'] = ResolversParentTypes['PlayerInWorld'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PlayerInfo'] = ResolversParentTypes['PlayerInfo'],
> = {
  __resolveType: TypeResolveFn<
    'Player' | 'PlayerInWorld',
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type PointResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Point'] = ResolversParentTypes['Point'],
> = {
  x?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  invitesToWorlds?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['World']>>>,
    ParentType,
    ContextType
  >;
  me?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  world?: Resolver<
    Maybe<ResolversTypes['World']>,
    ParentType,
    ContextType,
    RequireFields<QueryWorldArgs, 'id'>
  >;
  worlds?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['World']>>>,
    ParentType,
    ContextType
  >;
};

export type RoleResolvers = EnumResolverSignature<
  { GAMEMASTER?: any; USER?: any },
  ResolversTypes['Role']
>;

export type SceneResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Scene'] = ResolversParentTypes['Scene'],
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  world?: Resolver<ResolversTypes['World'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  walls?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Wall']>>>,
    ParentType,
    ContextType
  >;
  lights?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Light']>>>,
    ParentType,
    ContextType
  >;
  image?: Resolver<Maybe<ResolversTypes['Blob']>, ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  grid?: Resolver<
    Maybe<ResolversTypes['GridSettings']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = {
  diceRolls?: SubscriptionResolver<
    Array<Maybe<ResolversTypes['DiceRoll']>>,
    'diceRolls',
    ParentType,
    ContextType,
    RequireFields<SubscriptionDiceRollsArgs, 'worldId'>
  >;
  newMessages?: SubscriptionResolver<
    Array<Maybe<ResolversTypes['Message']>>,
    'newMessages',
    ParentType,
    ContextType,
    RequireFields<SubscriptionNewMessagesArgs, 'worldId'>
  >;
};

export type WallResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Wall'] = ResolversParentTypes['Wall'],
> = {
  points?: Resolver<Array<ResolversTypes['Point']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['World'] = ResolversParentTypes['World'],
> = {
  creator?: Resolver<
    Maybe<ResolversTypes['PlayerInWorld']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isListed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPasswordProtected?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  messages?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Message']>>>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['PlayerInWorld']>>>,
    ParentType,
    ContextType
  >;
  scenes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Scene']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthInfo?: AuthInfoResolvers<ContextType>;
  Blob?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DiceRoll?: DiceRollResolvers<ContextType>;
  Die?: DieResolvers<ContextType>;
  GridSettings?: GridSettingsResolvers<ContextType>;
  Light?: LightResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  PlayerInWorld?: PlayerInWorldResolvers<ContextType>;
  PlayerInfo?: PlayerInfoResolvers<ContextType>;
  Point?: PointResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers;
  Scene?: SceneResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Wall?: WallResolvers<ContextType>;
  World?: WorldResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
