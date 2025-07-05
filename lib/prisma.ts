import { PrismaClient } from '@prisma/client';
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Add logging to help debug database connection issues

console.log('Initializing Prisma client...');
// Check if we already have a Prisma instance
if (globalForPrisma.prisma) {
  console.log('Using existing Prisma client from global object');
} else {
  console.log('Creating new Prisma client');
}

// Create or reuse the Prisma client
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Attach to global object in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Development environment detected, attaching Prisma to global object');
  globalForPrisma.prisma = prisma;
}

console.log('Prisma client initialized successfully');

