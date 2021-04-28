import { IncomingMessage } from 'http';
import { Http2ServerRequest } from 'http2';
import { verify } from 'jsonwebtoken';

export function getPlayerId(
  requestOrToken: IncomingMessage | Http2ServerRequest | string,
): string | null {
  if (typeof requestOrToken === 'string') {
    const { playerId } = getTokenPayload(requestOrToken);
    return playerId;
  } else {
    const authHeader = requestOrToken.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { playerId } = getTokenPayload(token);
      return playerId;
    }
  }

  return null;
}

function getTokenPayload(token: string) {
  return verify(token, process.env.JWT_SECRET ?? 'aiacta') as any;
}
