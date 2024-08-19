import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import { authRouter } from './routes/authRoutes.js';

const app = express();
export const prisma = new PrismaClient();

dotenv.config();
app.use(cors());
app.use(express.json());

const host = 'localhost';
const port = 8080;

async function main() {
  app.use(authRouter);

  app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
