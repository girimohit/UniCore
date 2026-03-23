import { prisma } from '../db';

export async function resolveTenant(subdomain: string) {
  if (!subdomain) return null;

  try {
    // const institution = await prisma.institution.findUnique({
    //   where: { slug: subdomain }, // subdomain variable name is kept but maps to slug field
    //   include: {
    //     institutionModules: {
    //       include: {
    //         module: true
    //       }
    //     }
    //   }
    const institution = await prisma.institution.findUnique({
      where: { slug: subdomain },
      select: { id: true, name: true }
    });

    return institution;
  } catch (error) {
    console.error("Error resolving tenant:", error);
    return null;
  }
}
