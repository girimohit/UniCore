const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("./generated/prisma");
require("dotenv").config();

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});
const prisma = new PrismaClient({ adapter });

async function verify() {
  try {
    const institution = await prisma.institution.findFirst({
      select: {
        id: true,
        name: true,
        academicStructure: true
      }
    });
    console.log('Institution findFirst result:', JSON.stringify(institution, null, 2));

    const subject = await prisma.subject.findFirst({
      select: {
        id: true,
        name: true,
        cycleNumber: true
      }
    });
    console.log('Subject findFirst result:', JSON.stringify(subject, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

verify();
