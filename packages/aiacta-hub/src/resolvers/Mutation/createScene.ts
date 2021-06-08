import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const MutationCreateSceneResolver: Resolvers<Context> = {
  Mutation: {
    createScene: async (_, { input }, { prisma }) => {
      const scene = await prisma.scene.create({
        data: {
          worldId: input.worldId,
          name: input.name,
          width: input.width,
          height: input.height,
          image: input.image?.toBuffer(),
          gridSize: input.grid?.size ?? 50,
          gridOffsetX: input.grid?.offset.x,
          gridOffsetY: input.grid?.offset.y,
          walls: input.walls,
          lights: input.lights,
        },
      });
      return {
        ...scene,
        grid: {
          size: scene.gridSize,
          offset: { x: scene.gridOffsetX, y: scene.gridOffsetY },
        },
        walls: scene.walls as any,
        lights: scene.lights as any,
      };
    },
  },
};
