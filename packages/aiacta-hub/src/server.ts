import {
  createServer as createHttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import ws from 'ws';

const port = +(process.env.PORT ?? 8080);

export function createServer({
  onRequest,
  onSocket,
}: {
  onRequest: (
    request: IncomingMessage & { body?: string },
    response: ServerResponse,
  ) => Promise<void>;
  onSocket: (ws: ws, request: IncomingMessage) => void;
}) {
  const wsServer = new ws.Server({ noServer: true });
  const server = createHttpServer(async (request, response) => {
    if (request.headers['upgrade'] === 'websocket') {
      wsServer.handleUpgrade(request, request.socket, [] as any, (ws) =>
        wsServer.emit('connection', ws, request),
      );
    } else if (request.method === 'GET') {
      try {
        await onRequest(request, response);
      } catch (err) {
        console.error(err);
        response.writeHead(500);
        response.end('500 Internal server error');
      }
    } else {
      let body = '';
      request.on('data', (chunk) => (body += chunk.toString()));
      request.on('end', async () => {
        try {
          (request as any).body = body;
          await onRequest(request, response);
        } catch (err) {
          console.error(err);
          response.writeHead(500);
          response.end('500 Internal server error');
        }
      });
    }
  });
  wsServer.on('connection', (ws, request) => onSocket(ws, request));

  return new Promise<[(cb: () => void) => void, number]>((resolve) => {
    server.listen(port, () =>
      resolve([
        (cb) => {
          wsServer.close(() => server.close(cb));
          setTimeout(cb, 2500);
        },
        port,
      ]),
    );
  });
}
