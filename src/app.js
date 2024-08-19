import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { corsOptions } from './config/cors.js';

import { authRouter } from './routes/authRoutes.js';

const app = express();
export const prisma = new PrismaClient();

dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 3000;

async function main() {
  app.use(authRouter);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
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
