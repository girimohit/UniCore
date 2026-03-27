import { prisma } from '../db';

export async function resolveTenant(username: string) {
  if (!username) return null;

  try {
    const institution = await prisma.institution.findFirst({
      where: {
        OR: [
          { slug: username },
          { id: username }
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
