import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
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

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
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
  TArgs
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
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
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
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Role: Role;
  AuthInfo: ResolverTypeWrapper<AuthInfo>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  World: ResolverTypeWrapper<World>;
  PlayerInfo: ResolversTypes['PlayerInWorld'] | ResolversTypes['Player'];
  PlayerInWorld: ResolverTypeWrapper<PlayerInWorld>;
  Player: ResolverTypeWrapper<Player>;
  Message: ResolverTypeWrapper<Message>;
  MessageInput: MessageInput;
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthInfo: AuthInfo;
  String: Scalars['String'];
  Mutation: {};
  ID: Scalars['ID'];
  World: World;
  PlayerInfo:
    | ResolversParentTypes['PlayerInWorld']
    | ResolversParentTypes['Player'];
  PlayerInWorld: PlayerInWorld;
  Player: Player;
  Message: Message;
  MessageInput: MessageInput;
  Query: {};
  Subscription: {};
  Boolean: Scalars['Boolean'];
};

export type AuthInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuthInfo'] = ResolversParentTypes['AuthInfo']
> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player?: Resolver<ResolversTypes['Player'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  login?: Resolver<
    Maybe<ResolversTypes['AuthInfo']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'name' | 'password'>
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

export type WorldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['World'] = ResolversParentTypes['World']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  players?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['PlayerInWorld']>>>,
    ParentType,
    ContextType
  >;
  messages?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Message']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerInfoResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PlayerInfo'] = ResolversParentTypes['PlayerInfo']
> = {
  __resolveType: TypeResolveFn<
    'PlayerInWorld' | 'Player',
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type PlayerInWorldResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PlayerInWorld'] = ResolversParentTypes['PlayerInWorld']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']
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

export type MessageResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  component?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  worlds?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['World']>>>,
    ParentType,
    ContextType
  >;
  world?: Resolver<
    Maybe<ResolversTypes['World']>,
    ParentType,
    ContextType,
    RequireFields<QueryWorldArgs, 'id'>
  >;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  newMessages?: SubscriptionResolver<
    Array<Maybe<ResolversTypes['Message']>>,
    'newMessages',
    ParentType,
    ContextType,
    RequireFields<SubscriptionNewMessagesArgs, 'worldId'>
  >;
};

export type Resolvers<ContextType = any> = {
  AuthInfo?: AuthInfoResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  World?: WorldResolvers<ContextType>;
  PlayerInfo?: PlayerInfoResolvers<ContextType>;
  PlayerInWorld?: PlayerInWorldResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
