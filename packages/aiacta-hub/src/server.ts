import { readFileSync } from 'fs';
import { IncomingMessage } from 'http';
import {
  createSecureServer,
  Http2ServerRequest,
  Http2ServerResponse,
} from 'http2';
import { resolve } from 'path';
import ws from 'ws';

const port = +(process.env.PORT ?? 8080);

export function createServer({
  onRequest,
  onSocket,
}: {
  onRequest: (
    request: Http2ServerRequest & { body?: string },
    response: Http2ServerResponse,
  ) => Promise<void>;
  onSocket: (ws: ws, request: IncomingMessage) => void;
}) {
  const wsServer = new ws.Server({ noServer: true });
  const server = createSecureServer(
    {
      key: readFileSync(
        process.env.SSL_KEY ?? resolve(__dirname, '../server.key'),
      ),
      cert: readFileSync(
        process.env.SSL_CERTIFICATE ?? resolve(__dirname, '../server.crt'),
      ),
      allowHTTP1: true,
    },
    async (request, response) => {
      if (request.headers['upgrade'] === 'websocket') {
        wsServer.handleUpgrade(
          request as any,
          request.socket,
          [] as any,
          (ws) => wsServer.emit('connection', ws, request),
        );
      } else if (request.method === 'GET') {
        try {
          await onRequest(request, response);
        } catch (err) {
          console.error(err);
          response.writeHead(500);
          response.end('HTTP/2 500 Internal server error');
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
            response.end('HTTP/2 500 Internal server error');
          }
        });
      }
    },
  );
  wsServer.on('connection', (ws, request) => onSocket(ws, request));

  return new Promise<number>((resolve) => {
    server.listen(port, () => resolve(port));
  });
}
