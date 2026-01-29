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


/**
 * Seed data
 */
const tenantData: Prisma.TenantCreateInput = {
    name: "Unicore Demo College",
    code: "UDC",
};

const moduleData: Prisma.ModuleCreateInput[] = [
    { code: "EXAM", name: "Examination Module" },
    { code: "ATTENDANCE", name: "Attendance Module" },
    { code: "FEES", name: "Fees Management" },
    { code: "ACADEMICS", name: "Academics Module" },
];

export async function main() {
    console.log("🌱 Seeding UNICORE database...");

    /**
     * 1. Create Tenant
     */
    const tenant = await prisma.tenant.create({
        data: tenantData,
    });

    /**
     * 2. Create Modules
     */
    for (const mod of moduleData) {
        await prisma.module.upsert({
            where: { code: mod.code },
            update: {},
            create: mod,
        });
    }

    const examModule = await prisma.module.findUnique({
        where: { code: "EXAM" },
    });

    /**
     * 3. Enable Exam Module for Tenant
     */
    if (examModule) {
        await prisma.tenantModule.create({
            data: {
                tenantId: tenant.id,
                moduleId: examModule.id,
                enabled: true,
            },
        });
    }

    /**
     * 4. Create Users
     */
    const admin = await prisma.user.create({
        data: {
            tenantId: tenant.id,
            name: "System Admin",
            email: "admin@unicore.edu",
            role: "ADMIN",
        },
    });

    const student = await prisma.user.create({
        data: {
            tenantId: tenant.id,
            name: "Rahul Verma",
            email: "student@unicore.edu",
            role: "STUDENT",
        },
    });

    /**
     * 5. Create Feature Flags
     */
    await prisma.tenantFeature.createMany({
        data: [
            {
                tenantId: tenant.id,
                key: "exam.grade_only",
                value: "true",
            },
            {
                tenantId: tenant.id,
                key: "exam.external_enabled",
                value: "false",
            },
        ],
    });

    /**
     * 6. Create Exam
     */
    const exam = await prisma.exam.create({
        data: {
            tenantId: tenant.id,
            name: "Semester 5 End Term",
            semester: "SEM-5",
        },
    });

    /**
     * 7. Create Exam Result
     */
    await prisma.examResult.create({
        data: {
            examId: exam.id,
            studentId: student.id,
            marks: 78,
            grade: "A",
        },
    });

    console.log("✅ UNICORE seed completed successfully");
}

/**
 * Execute seed
 */
main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
