-- CreateTable
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" BYTEA,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "walls" JSONB[],
    "lights" JSONB[],
    "gridSize" INTEGER NOT NULL,
    "gridOffsetX" INTEGER NOT NULL DEFAULT 0,
    "gridOffsetY" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Scene" ADD FOREIGN KEY ("worldId") REFERENCES "World"("id") ON DELETE CASCADE ON UPDATE CASCADE;
