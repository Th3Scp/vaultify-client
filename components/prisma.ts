import { PrismaClient } from "@prisma/client";
import prismaRandom from 'prisma-extension-random';

// Create a single PrismaClient instance with the extension
// const DB = new PrismaClient().$extends(prismaRandom());
const DB = new PrismaClient();

// Handle graceful shutdown to close the Prisma client connection
process.on('beforeExit', async () => {
  await DB.$disconnect();
});

export default DB;
