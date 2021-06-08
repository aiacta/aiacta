import { Resolvers } from '@aiacta/graphql';
import { Context } from '../../context';

export const WorldSceneResolver: Resolvers<Context> = {
  World: {
    scene: async (world, { id }, { prisma }) => {
      const scene = (
        await prisma.world.findUnique({
          where: { id: world.id },
          include: { scenes: { where: { id } } },
        })
      )?.scenes[0];

      if (!scene) {
        return null;
      }

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
