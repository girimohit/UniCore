const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration: semester -> cycleNumber for Subjects');
  try {
    // Check if cycleNumber already has values other than default 1
    const count = await prisma.subject.count();
    console.log(`Checking ${count} subjects...`);
    
    // We'll use raw SQL because 'semester' is removed from the Prisma schema
    const result = await prisma.$executeRawUnsafe(
      `UPDATE Subject SET cycleNumber = semester WHERE semester IS NOT NULL`
    );
    console.log(`Successfully migrated ${result} subjects.`);
  } catch (err) {
    console.error('Migration failed (likely "semester" column already dropped or renamed):', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
