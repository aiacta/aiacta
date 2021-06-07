import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldScenesResolver: Resolvers<Context> = {
  World: {
    scenes: async (world, __, { prisma }) => {
      return (
        await prisma.scene.findMany({
          where: { worldId: world.id },
        })
      ).map(
        ({
          id,
          name,
          image,
          width,
          height,
          gridSize,
          gridOffsetX,
          gridOffsetY,
          walls,
          lights,
        }) => ({
          id,
          name,
          image,
          width,
          height,
          grid: { size: gridSize, offset: { x: gridOffsetX, y: gridOffsetY } },
          walls: walls as any,
          lights: lights as any,
        }),
      );
    },
  },
};
