//  ------------------------ FOR NEON ------------------------
import { env } from '../env'
import { PrismaClient } from '../../generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: env.DATABASE_URL,
})

export const prisma = new PrismaClient({ adapter })







//  ------------------------ FOR POSTGRESQL ------------------------
// import { Pool } from 'pg'
// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from '../../generated/prisma/client'

// // Prisma 7 Singleton Pattern for Next.js
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
//   pool: Pool | undefined
// }

// const pool = globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })
// if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool

// const adapter = new PrismaPg(pool)

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     adapter,
//     log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//     // Increased timeouts for Neon/Serverless (Prisma 7)
//     transactionOptions: {
//       maxWait: 10000, // 10 seconds to acquire a connection
//       timeout: 20000,  // 20 seconds total transaction time
//     },
//   })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma




//  ------------------------ FOR MYSQL ------------------------
// // import "dotenv/config";
// // import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// // import { PrismaClient } from '../../generated/prisma';
// // // import { PrismaClient } from "../generated/prisma/client";

// // const adapter = new PrismaMariaDb({
// //   host: process.env.DATABASE_HOST,
// //   user: process.env.DATABASE_USER,
// //   password: process.env.DATABASE_PASSWORD,
// //   database: process.env.DATABASE_NAME,
// //   connectionLimit: 5,
// // });
// // const prisma = new PrismaClient({ adapter });

// // export { prisma };
