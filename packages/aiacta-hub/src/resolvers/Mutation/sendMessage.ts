import Program from '@aiacta/dicelang';
import { ForbiddenError, Resolvers } from '@aiacta/graphql';
import { DieType } from '@aiacta/graphql/src/resolvers';
import { v4 as uuid } from 'uuid';
import { Context } from '../../context';

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

              const rolledDice: {
                id: string;
                type: DieType;
                value: number;
              }[] = [];
              const result = await new Program(args).run(
                {
                  async roll(faces) {
                    const value = Math.round(Math.random() * (faces - 1)) + 1;
                    rolledDice.push({
                      id: uuid(),
                      type: ('D' + faces) as DieType,
                      value,
                    });
                    return value;
                  },
                },
                context,
              );

              const diceRoll = {
                worldId,
                id: uuid(),
                roller: { ...playerInWorld.player, role: playerInWorld.role },
                dice: rolledDice,
                message: result.toChatMessage(),
              };

              pubsub.publish('rollDice', diceRoll);
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
