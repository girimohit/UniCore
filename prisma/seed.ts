import { PrismaClient, Prisma } from "@/lib/generated/prisma/client";
// import { PrismaPg } from '@prisma/adapter-pg'


import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})


const prisma = new PrismaClient({
    adapter,
});







// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting advanced seeding...");

  /* ============================== TENANTS ============================== */
  const tenants = await prisma.tenant.createMany({
    data: [
      { name: "Demo University", code: "DEMO2025" },
      { name: "Tech Institute of India", code: "TII2025" },
      { name: "Global Management School", code: "GMS2025" },
    ],
  });

  const tenantList = await prisma.tenant.findMany();

  /* ============================ DEPARTMENTS ============================ */
  for (const tenant of tenantList) {
    await prisma.department.createMany({
      data: [
        { name: "Computer Science", tenantId: tenant.id },
        { name: "Electronics", tenantId: tenant.id },
        { name: "Mechanical", tenantId: tenant.id },
        { name: "Civil", tenantId: tenant.id },
      ],
    });
  }

  const departments = await prisma.department.findMany();

  /* ============================== PROGRAMS ============================== */
  for (const dept of departments) {
    await prisma.program.createMany({
      data: [
        {
          name: "B.Tech",
          departmentId: dept.id,
          tenantId: dept.tenantId,
        },
        {
          name: "M.Tech",
          departmentId: dept.id,
          tenantId: dept.tenantId,
        },
      ],
    });
  }

  const programs = await prisma.program.findMany();

  /* ============================== SUBJECTS ============================== */
  for (const program of programs) {
    await prisma.subject.createMany({
      data: [
        {
          name: "Introduction to Programming",
          programId: program.id,
          tenantId: program.tenantId,
        },
        {
          name: "Data Structures",
          programId: program.id,
          tenantId: program.tenantId,
        },
        {
          name: "Database Systems",
          programId: program.id,
          tenantId: program.tenantId,
        },
      ],
    });
  }

  const subjects = await prisma.subject.findMany();

  /* ================================ USERS ================================ */
  for (const tenant of tenantList) {
    // Admin
    await prisma.user.create({
      data: {
        clerkId: `admin_${tenant.code}`,
        name: `${tenant.name} Admin`,
        email: `admin@${tenant.code.toLowerCase()}.edu`,
        role: "ADMIN",
        tenantId: tenant.id,
      },
    });

    // Faculty
    for (let i = 1; i <= 3; i++) {
      await prisma.user.create({
        data: {
          clerkId: `faculty_${tenant.code}_${i}`,
          name: `Faculty ${i} (${tenant.name})`,
          email: `faculty${i}@${tenant.code.toLowerCase()}.edu`,
          role: "FACULTY",
          tenantId: tenant.id,
        },
      });
    }
  }

  const facultyList = await prisma.user.findMany({
    where: { role: "FACULTY" },
  });

  /* ============================== STUDENTS ============================== */
  for (const program of programs) {
    for (let i = 1; i <= 5; i++) {
      await prisma.user.create({
        data: {
          clerkId: `student_${program.id}_${i}`,
          name: `Student ${i}`,
          email: `student${i}_${program.id}@demo.edu`,
          role: "STUDENT",
          tenantId: program.tenantId,
          programId: program.id,
        },
      });
    }
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
  });

  /* ============================= ENROLLMENTS ============================= */
  for (const student of students) {
    const programSubjects = subjects.filter(
      (s) => s.tenantId === student.tenantId
    );

    for (const subject of programSubjects.slice(0, 3)) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          tenantId: student.tenantId,
        },
      });
    }
  }

  /* ============================== ATTENDANCE ============================== */
  for (const student of students.slice(0, 20)) {
    await prisma.attendance.create({
      data: {
        studentId: student.id,
        subjectId: subjects[0].id,
        date: new Date(),
        status: Math.random() > 0.3 ? "PRESENT" : "ABSENT",
        markedBy: facultyList[0].id,
        tenantId: student.tenantId,
      },
    });
  }

  /* ================================ NOTICES ================================ */
  for (const tenant of tenantList) {
    await prisma.notice.createMany({
      data: [
        {
          title: "Semester Notice",
          content: "New semester begins next week.",
          tenantId: tenant.id,
        },
        {
          title: "Exam Announcement",
          content: "Mid-term exams scheduled soon.",
          tenantId: tenant.id,
        },
        {
          title: "Holiday",
          content: "Campus closed on Friday.",
          tenantId: tenant.id,
        },
        {
          title: "Workshop",
          content: "Technical workshop this weekend.",
          tenantId: tenant.id,
        },
      ],
    });
  }

  console.log("✅ Advanced seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
















