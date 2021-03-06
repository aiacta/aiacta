import { buildExecutableSchema } from '@aiacta/graphql';
import { cyan, cyanBright, green } from 'colorette';
import 'dotenv/config';
import { Server as StaticServer } from 'node-static';
import { networkInterfaces } from 'os';
import { resolve } from 'path';
import { createContext } from './context';
import { resolvers } from './resolvers';
import { createServer } from './server';

const graphql = buildExecutableSchema({
  resolvers,
  context: createContext,
});

const frontend = new StaticServer(resolve(__dirname, 'frontend'));
let disposeServer: (cb: () => void) => void;

createServer({
  onRequest: async (request, response) => {
    if (request.method === 'GET') {
      frontend.serve(request, response, (err: any) => {
        if (err?.status === 404 && !request.url?.match(/\.\w{2,4}$/)) {
          frontend.serveFile('/index.html', 200, {}, request, response);
        }
      });
    } else {
      const { query, variables, operationName } =
        request.operations ?? JSON.parse(request.body ?? '{}');
      const result = await graphql.execute({
        request,
        document: query,
        variables,
        operation: operationName,
      });
      response.writeHead(200);
      response.end(JSON.stringify(result));
    }
  },
  onSocket: (socket, request) => {
    const closed = graphql.ws.opened(
      {
        protocol: socket.protocol, // will be validated
        send: (data) =>
          new Promise((resolve, reject) => {
            socket.send(data, (err) => (err ? reject(err) : resolve()));
          }), // control your data flow by timing the promise resolve
        close: (code, reason) => socket.close(code, reason), // there are protocol standard closures
        onMessage: (cb) =>
          socket.on('message', async (event) => {
            try {
              // wait for the the operation to complete
              // - if init message, waits for connect
              // - if query/mutation, waits for result
              // - if subscription, waits for complete
              await cb(event.toString());
            } catch (err) {
              // all errors that could be thrown during the
              // execution of operations will be caught here
              if (err instanceof Error) {
                socket.close(1011, err.message);
              } else {
                socket.close(1011, 'Unknown');
              }
            }
          }),
      },
      // pass values to the `extra` field in the context
      { request },
    );

    // notify server that the socket closed
    socket.once('close', (code, reason) => closed(code, reason.toString()));
  },
}).then(([dispose, port]) => {
  disposeServer = dispose;
  const portColored = cyanBright(port);
  const ip = Object.values(networkInterfaces())
    .flat()
    .filter(
      (details) => details?.family === 'IPv4' && !details.internal,
    )[0]?.address;

  console.clear();
  if (process.env.NODE_ENV === 'development') {
    console.log(`  ${cyan('aiacta')} ${green('dev server running at:')}`);
    console.log('');
    console.log(`  > Local:    ${cyan(`http://localhost:${portColored}/`)}`);
    console.log(`              ${cyan(`ws://localhost:${portColored}/`)}`);
    console.log(`  > Network:  ${cyan(`http://${ip}:${portColored}/`)}`);
    console.log(`              ${cyan(`ws://${ip}:${portColored}/`)}`);
  } else {
    console.log(`  ${cyan('aiacta')} ${green('server running at:')}`);
    console.log('');
    console.log(`    ${cyan(`http://${ip}:${portColored}/`)}`);
    console.log(`    ${cyan(`ws://${ip}:${portColored}/`)}`);
  }
  console.log('');
});

process.on('SIGTERM', () => {
  disposeServer?.(() => {
    process.exit(0);
  });
});
