import busboy from 'busboy';
import {
  createServer as createHttpServer,
  IncomingMessage,
  ServerResponse,
} from 'http';
import { Readable } from 'stream';
import ws from 'ws';

const port = +(process.env.PORT ?? 8080);

export function createServer({
  onRequest,
  onSocket,
}: {
  onRequest: (
    request: IncomingMessage & {
      body?: string;
      operations?: { query: string; variables?: any; operationName?: string };
    },
    response: ServerResponse,
  ) => Promise<void>;
  onSocket: (ws: ws.WebSocket, request: IncomingMessage) => void;
}) {
  const wsServer = new ws.WebSocketServer({ noServer: true });
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
      if (request.headers['content-type']?.startsWith('multipart/form-data')) {
        let operations: any;
        let map: Record<string, string[]>;
        const uploads = new Map<string, Upload>();
        const parser = busboy({ headers: request.headers });
        parser.on('field', (fieldName, fieldValue) => {
          switch (fieldName) {
            case 'operations':
              operations = JSON.parse(fieldValue);
              break;
            case 'map':
              map = JSON.parse(fieldValue);
              break;
          }
        });
        parser.on('file', (fieldName, fileStream) => {
          uploads.set(fieldName, new Upload(fileStream));
        });
        parser.once('finish', async () => {
          request.unpipe(parser);
          request.resume();

          Object.entries(map).forEach(([fileKey, operationPaths]) => {
            operationPaths.forEach((path) => {
              const [key, ...pathTo] = path.split('.').reverse();
              const obj = pathTo.reduceRight(
                (acc, key) => acc[key],
                operations,
              );
              obj[key] = uploads.get(fileKey);
            });
          });

          try {
            (request as any).operations = operations;
            await onRequest(request, response);
          } catch (err) {
            console.error(err);
            response.writeHead(500);
            response.end('500 Internal server error');
          }
        });

        request.pipe(parser);

        return;
      }

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

class Upload {
  private data: Buffer | undefined;

  constructor(stream: NodeJS.ReadableStream) {
    let data: Buffer;
    stream.on('data', (buffer) => {
      if (!data) {
        data = buffer;
      } else {
        data = Buffer.concat([data, buffer]);
      }
    });
    stream.on('end', () => {
      this.data = data;
    });
  }

  createReadStream() {
    const readable = new Readable();
    readable._read = () => undefined;
    readable.push(this.data);
    readable.push(null);
    return readable;
  }

  toBuffer() {
    return this.data;
  }
}
