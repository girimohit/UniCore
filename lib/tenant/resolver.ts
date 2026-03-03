import { prisma } from '../db';

export async function resolveTenant(subdomain: string) {
  if (!subdomain) return null;

  try {
    const institution = await prisma.institution.findUnique({
      where: { subdomain },
      include: {
        institutionModules: {
          include: {
            module: true
          }
        }
      }
    });

    return institution;
  } catch (error) {
    console.error("Error resolving tenant:", error);
    return null;
  }
}
