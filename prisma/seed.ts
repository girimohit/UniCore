/**
 * Dev Seed Script — Restores test data after a DB reset.
 * Run with: npx tsx prisma/seed.ts
 *
 * Creates:
 *   - Delhi University (slug: du) → admin ADM001:duuadmin
 *   - AB College (slug: ab-college) → admin ADM001:abbadmin
 *   - Columbia University (slug: columbia) → admin ADM001:coladmin
 * 
 * Each institution gets:
 *   - All modules seeded (from SYSTEM_MODULES registry)
 *   - Default academic term (current semester)
 */

import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import { SYSTEM_MODULES } from '../lib/modules/registry';

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 10);
}

async function seedInstitution(name: string, slug: string, adminPassword: string) {
  console.log(`\n🏛️  Seeding: ${name} (/${slug})`);

  // Create Institution
  const institution = await prisma.institution.upsert({
    where: { slug },
    update: {},
    create: {
      name,
      slug,
      status: 'ACTIVE',
      academicSystem: 'SEMESTER',
      academicStructure: JSON.stringify({ type: 'SEMESTER', totalCycles: 8 }),
    }
  });

  // Create Admin User (only if not exists)
  const existingAdmin = await prisma.user.findFirst({
    where: { institutionId: institution.id, username: 'ADM001' }
  });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        institutionId: institution.id,
        username: 'ADM001',
        name: `${name} Admin`,
        passwordHash: await hash(adminPassword),
        role: 'ADMIN',
        email: `admin@${slug}.edu`,
        accountStatus: 'ACTIVE',
      }
    });
  }

  // Create Academic Term
  await prisma.academicTerm.upsert({
    where: { id: `seed_term_${slug}` },
    update: {},
    create: {
      id: `seed_term_${slug}`,
      institutionId: institution.id,
      name: 'Semester 1 (2024-25)',
      type: 'SEMESTER',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-12-31'),
    }
  });

  // Seed modules — ensure the Module table has entries and subscriptions exist
  for (const [moduleId, meta] of Object.entries(SYSTEM_MODULES)) {
    // Upsert the Module record
    const mod = await prisma.module.upsert({
      where: { name: moduleId },
      update: {},
      create: {
        name: moduleId,
        description: meta.description,
      }
    });

    // Upsert the subscription (enabled by default based on registry)
    await prisma.moduleSubscription.upsert({
      where: { institutionId_moduleId: { institutionId: institution.id, moduleId: mod.id } },
      update: {},
      create: {
        institutionId: institution.id,
        moduleId: mod.id,
        isActive: meta.defaultEnabled,
      }
    });
  }

  console.log(`   ✅ Admin: ADM001 / ${adminPassword}`);
  console.log(`   ✅ URL: http://localhost:3000/${slug}/admin`);
  return { institution };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // ----- Institutions -----
  await seedInstitution('Delhi University', 'du', 'duuadmin');
  await seedInstitution('AB College', 'ab-college', 'abbadmin');
  await seedInstitution('Columbia University', 'columbia', 'coladmin');

  console.log('\n🎉 Seed complete! All institutions restored.\n');
  console.log('📝 Login credentials:');
  console.log('   du          → ADM001 / duuadmin     → /du/admin');
  console.log('   ab-college  → ADM001 / abbadmin     → /ab-college/admin');
  console.log('   columbia    → ADM001 / coladmin     → /columbia/admin');
  console.log('\n   Note: Faculty and students need to be re-added via the admin panel.');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
