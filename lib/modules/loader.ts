import { prisma } from '@/lib/db';
import { SYSTEM_MODULES, ModuleMetadata } from './registry';

/**
 * Ensures that all physically written modules inside SYSTEM_MODULES 
 * are synced securely to the global database metadata source.
 */
export async function syncSystemModules() {
  for (const modConfig of Object.values(SYSTEM_MODULES)) {
    await prisma.module.upsert({
      where: { name: modConfig.id },
      update: { description: modConfig.description },
      create: {
        name: modConfig.id,
        description: modConfig.description,
      }
    });
  }
}

/**
 * Dynamic Module Loader
 * 
 * Given a tenant's ID, fetches their currently enabled modules and
 * returns the full metadata configuration mapping for rendering the UI.
 * 
 * Usage: Server Components layout.tsx evaluating what side-bar links to render.
 */
export async function getActiveInstitutionModules(institutionId: string): Promise<ModuleMetadata[]> {
  const overrides = await prisma.moduleSubscription.findMany({
    where: {
      institutionId,
      isActive: true,
    },
    include: { module: true }
  });

  const activeModuleIds = new Set(overrides.map(om => om.module.name));

  // Merge database states with hardcoded core default requirements
  const renderedModules: ModuleMetadata[] = [];

  for (const [, metadata] of Object.entries(SYSTEM_MODULES)) {
    // If it's explicitly enabled in the DB, or if it's a CORE module (which defaults to on unless strictly disabled usually, though here we rely on the override specifically)
    // Actually, usually tenants start with InstitutionModule records generated upon tenant creation.
    if (activeModuleIds.has(metadata.id) || (metadata.type === 'CORE' && metadata.defaultEnabled)) {
      // Enforce basic dependencies checks
      if (metadata.dependencies) {
        const hasDependencies = metadata.dependencies.every(dep => activeModuleIds.has(dep) || SYSTEM_MODULES[dep]?.defaultEnabled);
        if (!hasDependencies) continue; // Drop module if missing strict dependencies
      }

      renderedModules.push(metadata);
    }
  }

  return renderedModules;
}

/**
 * Feature Flag API Validator
 * Quickly asserts whether the active tenant execution context has access to an API Module.
 */
export async function isModuleEnabled(institutionId: string, moduleId: string): Promise<boolean> {
  const activeModules = await getActiveInstitutionModules(institutionId);
  return activeModules.some(m => m.id === moduleId);
}
