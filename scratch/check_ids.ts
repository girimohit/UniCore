import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  console.log("--- INSTITUTIONS ---");
  const institutions = await prisma.institution.findMany({ select: { id: true, name: true, slug: true } });
  console.log(JSON.stringify(institutions, null, 2));

  console.log("\n--- COURSES ---");
  const courses = await prisma.course.findMany({ select: { id: true, name: true, code: true } });
  console.log(JSON.stringify(courses, null, 2));

  console.log("\n--- STUDENTS ---");
  const students = await prisma.student.findMany({ 
    include: { user: { select: { id: true, name: true, username: true } } } 
  });
  console.log(JSON.stringify(students.map(s => ({
    studentId: s.id,
    userId: s.user.id,
    name: s.user.name,
    roll: s.rollNumber
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
