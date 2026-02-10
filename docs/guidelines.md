## Tools used 
 - Clerk 
 - Zod
 - Prisma
 - GraphQL
 - Stripe
 - Supabase / Neon
 - Docker
 - Kubernetes 
 - ShadCN 
 - Zustand
 - React Hook Form + Zod
 - Solidity

 ## Prisma Instructions
 - CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

    CREATE NEW DATABASE:
    Local: npx prisma dev (runs Postgres locally in your terminal)
    Cloud: npx create-db (creates a free Prisma Postgres database)

    Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.


### Start with setting up clerk key and prisma : 
#### ~ Prisma
 - npm insatall prisma
 - setup neon database and copy credentials to .env 
 - add "DATABASE_URL" in .env 
 - npx prisma init
 - npx prisma dev
 - prisma db pull (to introspect)