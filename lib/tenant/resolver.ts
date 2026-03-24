import { prisma } from '../db';

export async function resolveTenant(identifier: string) {
  if (!identifier) return null;

  try {
    const institution = await prisma.institution.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { id: identifier }
        ]
      },
      select: { id: true, name: true, slug: true }
    });

    return institution;
  } catch (error) {
    console.error("Error resolving tenant:", error);
    return null;
  }
}
