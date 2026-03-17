import { prisma } from './lib/db';

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
