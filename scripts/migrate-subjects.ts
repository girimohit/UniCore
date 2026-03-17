import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration: semester -> cycleNumber for Subjects');
  
  // Note: Since I've already updated the schema, 'semester' might not be in the Prisma client anymore.
  // I might need to use raw SQL if I already ran generate.
  
  try {
    // Attempt raw SQL update if 'semester' column still exists in DB
    const result = await prisma.$executeRawUnsafe(
      `UPDATE Subject SET cycleNumber = semester WHERE semester IS NOT NULL`
    );
    console.log(`Successfully migrated ${result} subjects.`);
  } catch (err) {
    console.error('Migration failed (column might not exist):', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
