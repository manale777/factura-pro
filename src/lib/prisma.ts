import { PrismaPg } from '@prisma/adapter-pg'

const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined
}


function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient({
  log: ['query']
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

