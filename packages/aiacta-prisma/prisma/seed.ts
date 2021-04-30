import { PrismaClient } from './index';

const prisma = new PrismaClient();

async function main() {
  const gamemaster = await prisma.player.upsert({
    where: { name: 'Test Gamemaster' },
    update: {},
    create: {
      name: 'Test Gamemaster',
      password: '$2y$12$1fExKuw9idVwp7Bup58BtuNGtE/KLJnFQhYdxbfD5VQPHAiFTbste',
    },
  });

  const user = await prisma.player.upsert({
    where: { name: 'Test User' },
    update: {},
    create: {
      name: 'Test User',
      password: '$2y$12$us2OUJrUtSlG4HdDZY/1fegMT9fiOhwAWhznJaCoBW3Ywe4okS.KK',
    },
  });

  const world = await prisma.world.upsert({
    where: { name: 'Test World 1' },
    update: {},
    create: {
      name: 'Test World 1',
      creator: { connect: { id: gamemaster.id } },
    },
  });

  await prisma.playerInWorld.upsert({
    where: { playerId_worldId: { playerId: gamemaster.id, worldId: world.id } },
    update: {},
    create: {
      playerId: gamemaster.id,
      worldId: world.id,
      role: 'GAMEMASTER',
    },
  });
  await prisma.playerInWorld.upsert({
    where: { playerId_worldId: { playerId: user.id, worldId: world.id } },
    update: {},
    create: {
      playerId: user.id,
      worldId: world.id,
      role: 'USER',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
