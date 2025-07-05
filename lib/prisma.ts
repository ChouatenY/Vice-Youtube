import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if database URL is available
const isDatabaseConfigured = process.env.DATABASE_URL && process.env.DATABASE_URL !== '';

if (!isDatabaseConfigured) {
  console.warn('DATABASE_URL is not configured. Prisma client will not be initialized.');
}

// Create or reuse the Prisma client only if database is configured
export const prisma = isDatabaseConfigured
  ? (globalForPrisma.prisma || new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    }))
  : null;

// Attach to global object in development
if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

// Export a function to check if Prisma is available
export const isPrismaAvailable = () => prisma !== null;

