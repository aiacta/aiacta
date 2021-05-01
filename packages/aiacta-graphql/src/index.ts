import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadTypedefsSync } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { DocumentNode, execute, GraphQLError, parse } from 'graphql';
import { makeServer } from 'graphql-ws';
import { IncomingMessage } from 'http';
import { Http2ServerRequest } from 'http2';
import { resolve } from 'path';
import { Resolvers } from './resolvers';

export { Resolvers };

export function buildExecutableSchema<TContext>({
  resolvers,
  context,
}: {
  resolvers: Resolvers | Resolvers[];
  context: (request: IncomingMessage | Http2ServerRequest) => Promise<TContext>;
}) {
  const typeDefs = loadTypedefsSync(
    process.env.GRAPHQL_SCHEMA ?? resolve(__dirname, '../graphql/**/*.gql'),
    { loaders: [new GraphQLFileLoader()] },
  );

  const schema = makeExecutableSchema<TContext>({
    typeDefs: [...typeDefs.map((d) => d.document!).filter(Boolean)],
    resolvers,
  });

  return {
    schema,
    parse,
    execute: async ({
      request,
      document,
      variables,
      operation,
    }: {
      request: IncomingMessage | Http2ServerRequest;
      document: string | DocumentNode;
      variables?: Record<string, unknown>;
      operation?: string;
    }) =>
      execute({
        schema,
        document: typeof document === 'string' ? parse(document) : document,
        contextValue: await context(request),
        variableValues: variables,
        operationName: operation,
      }),
    ws: makeServer<{ request: IncomingMessage }>({
      onSubscribe: async (ctx, message) => {
        return {
          document: parse(message.payload.query),
          schema,
          contextValue: await context(ctx.extra.request),
          variableValues: message.payload.variables,
        };
      },
    }),
  };
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, undefined, undefined, {
      code: 'FORBIDDEN',
    });
  }
}

export class AuthError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, undefined, undefined, {
      code: 'UNAUTHORIZED',
    });
  }
}
