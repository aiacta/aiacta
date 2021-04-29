import { buildExecutableSchema } from '@aiacta/graphql';
import chalk from 'chalk';
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
createServer({
  onRequest: async (request, response) => {
    if (request.method === 'GET') {
      frontend.serve(request as any, response as any);
    } else {
      const { query, variables } = JSON.parse(request.body ?? '{}');
      const result = await graphql.execute({
        request,
        document: query,
        variables,
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
              socket.close(1011, err.message);
            }
          }),
      },
      // pass values to the `extra` field in the context
      { request },
    );

    // notify server that the socket closed
    socket.once('close', (code, reason) => closed(code, reason));
  },
}).then((port) => {
  const portColored = chalk.cyanBright(port);
  const ip = Object.values(networkInterfaces())
    .flat()
    .filter((details) => details?.family === 'IPv4' && !details.internal)[0]
    ?.address;

  console.clear();
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `  ${chalk.cyan('aiacta')} ${chalk.green('dev server running at:')}`,
    );
    console.log('');
    console.log(
      `  > Local:    ${chalk.cyan(`http://localhost:${portColored}/`)}`,
    );
    console.log(
      `              ${chalk.cyan(`ws://localhost:${portColored}/`)}`,
    );
    console.log(`  > Network:  ${chalk.cyan(`http://${ip}:${portColored}/`)}`);
    console.log(`              ${chalk.cyan(`ws://${ip}:${portColored}/`)}`);
  } else {
    console.log(
      `  ${chalk.cyan('aiacta')} ${chalk.green('server running at:')}`,
    );
    console.log('');
    console.log(`    ${chalk.cyan(`http://${ip}:${portColored}/`)}`);
    console.log(`    ${chalk.cyan(`ws://${ip}:${portColored}/`)}`);
  }
  console.log('');
});

process.on('SIGTERM', () => {
  process.exit(0);
});
