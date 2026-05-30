// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (!globalForPrisma.prisma) {
  // Cria a piscina de conexões do PG usando a variável de ambiente
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Cria o adapter exigido pelo Prisma 7
  const adapter = new PrismaPg(pool);
  
  // Passa o adapter para o construtor do PrismaClient
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma;