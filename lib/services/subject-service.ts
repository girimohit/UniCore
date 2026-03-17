import { prisma } from '@/lib/db';

export class SubjectService {
  /**
   * Validates if the given cycleNumber is valid for the institution's academic structure.
   * Throws an error if invalid.
   */
  static async validateCycleNumber(tenantId: string, cycleNumber: number) {
    if (cycleNumber < 1) {
      throw new Error('Cycle number must be at least 1');
    }

    const institution = await prisma.institution.findUnique({
      where: { id: tenantId },
      select: { academicStructure: true }
    });

    if (!institution) {
      throw new Error('Institution not found');
    }

    const structure = institution.academicStructure as any;
    const totalCycles = structure?.totalCycles || 8; // Default to 8 if not set

    if (cycleNumber > totalCycles) {
      throw new Error("Invalid cycleNumber for this tenant's academic structure");
    }

    return true;
  }
}
