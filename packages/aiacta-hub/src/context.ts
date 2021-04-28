import { PrismaClient } from '@aiacta/prisma';
import { IncomingMessage } from 'http';
import { Http2ServerRequest } from 'http2';
import { getPlayerId } from './auth';
import { PubSub } from './pubsub';

const pubsub = new PubSub();
const prisma = new PrismaClient();

type Resolved<T> = T extends Promise<infer U> ? U : never;
export type Context = Resolved<ReturnType<typeof createContext>>;

export async function createContext(
  request: IncomingMessage | Http2ServerRequest,
) {
  const playerId = getPlayerId(request);

  return {
    playerId,
    get player() {
      return playerId
        ? prisma.player.findUnique({ where: { id: playerId } })
        : null;
    },
    prisma,
    pubsub,
  };
}
