import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { v4 as uuid } from 'uuid';
import { Context } from '../../context';
import { rollDice } from '../../functions';

export const MutationSendMessageResolver: Resolvers<Context> = {
  Mutation: {
    sendMessage: async (
      _,
      { worldId, input: { component, text } },
      { playerId, prisma, pubsub },
    ) => {
      if (!playerId) {
        throw new ForbiddenError('Cannot write message');
      }

      try {
        const {
          blocks: [{ text: blockText }],
        } = JSON.parse(text ?? '{}');

        const {
          groups: { command, args },
        } = {
          groups: {} as { [key: string]: string },
          .../^\/(?<command>r(?:oll)?) (?<args>.*)/.exec(blockText),
        };

        switch (command) {
          case 'r':
          case 'roll':
            {
              const playerInWorld = await prisma.playerInWorld.findUnique({
                where: { playerId_worldId: { playerId, worldId } },
                include: { player: true },
              });

              if (!playerInWorld) {
                throw new ForbiddenError('Not logged in or invalid token');
              }

              const context = {}; // get from input def

              const { result, rolledDice } = await rollDice(args, context);

              const diceRoll = {
                worldId,
                id: uuid(),
                roller: { ...playerInWorld.player, role: playerInWorld.role },
                dice: rolledDice,
                message: result.toChatMessage(),
              };

              const message = await prisma.chatMessage.create({
                data: {
                  world: { connect: { id: worldId } },
                  author: { connect: { id: playerId } },
                  component: 'DiceRoll',
                  text: result.toChatMessage(),
                },
                include: {
                  author: true,
                },
              });

              pubsub.publish('rollDice', diceRoll);
              pubsub.publish('createMessage', message);
            }
            return null;
        }
      } catch (err) {
        console.error(err);
      }

      const message = await prisma.chatMessage.create({
        data: {
          world: { connect: { id: worldId } },
          author: { connect: { id: playerId } },
          component,
          text,
        },
        include: {
          author: true,
        },
      });

      pubsub.publish('createMessage', message);

      return message;
    },
  },
};
