import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { v4 as uuid } from 'uuid';
import { Context } from '../../context';
import { rollDice } from '../../functions';

export const MutationSendMessageResolver: Resolvers<Context> = {
  Mutation: {
    sendMessage: async (
      _,
      { worldId, input: { text } },
      { playerId, prisma, pubsub },
    ) => {
      if (!playerId) {
        throw new ForbiddenError('Cannot write message');
      }

      const playerInWorld = await prisma.playerInWorld.findUnique({
        where: { playerId_worldId: { playerId, worldId } },
        include: { player: true },
      });

      if (!playerInWorld) {
        throw new ForbiddenError('Not logged in or invalid token');
      }

      const {
        groups: { command, args },
      } = {
        groups: {} as { [key: string]: string },
        .../^\/(?<command>r(?:oll)?) (?<args>.*)/.exec(text ?? ''),
      };

      switch (command) {
        case 'r':
        case 'roll': {
          const diceRoll = await createRoll(args);

          const message = await prisma.chatMessage.create({
            data: {
              world: { connect: { id: worldId } },
              author: { connect: { id: playerId } },
              text: diceRoll.message,
              rolls: [diceRoll.id],
            },
            include: {
              author: true,
            },
          });

          pubsub.publish('createMessage', message);

          return message;
        }
      }

      // replace inline rolls
      const rolls: string[] = [];
      let substitutedText = text ?? '';
      let match: RegExpMatchArray | null;
      while ((match = substitutedText.match(/\[\[(?<inline>.*?)\]\]/))) {
        const diceRoll = await createRoll(match.groups!.inline);
        rolls.push(diceRoll.id);
        substitutedText =
          substitutedText?.substr(0, match.index) +
          diceRoll.message +
          substitutedText.substr((match.index ?? 0) + match[0].length);
      }

      const message = await prisma.chatMessage.create({
        data: {
          world: { connect: { id: worldId } },
          author: { connect: { id: playerId } },
          text: substitutedText,
          rolls,
        },
        include: {
          author: true,
        },
      });

      pubsub.publish('createMessage', message);

      return message;

      async function createRoll(formula: string) {
        const context = {}; // get from input def

        const { result, rolledDice } = await rollDice(formula, context);

        const diceRoll = {
          worldId,
          id: uuid(),
          roller: { ...playerInWorld!.player, role: playerInWorld!.role },
          dice: rolledDice,
          message: result.toChatMessage(true),
        };

        pubsub.publish('rollDice', diceRoll);

        return diceRoll;
      }
    },
  },
};
