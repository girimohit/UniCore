import { getActiveInstitutionModules } from "./loader";
import { notFound } from "next/navigation";

/**
 * Server-side guard to ensure a module is enabled.
 * Throws notFound() if the module is disabled or does not exist.
 */
export async function requireModule(institutionId: string, moduleId: string) {
  const activeModules = await getActiveInstitutionModules(institutionId);
  const isActive = activeModules.some(m => m.id === moduleId);

  if (!isActive) {
    notFound();
  }
}
