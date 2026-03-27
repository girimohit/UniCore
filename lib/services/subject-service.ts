import { prisma } from '@/lib/db';
import { getAcademicLabel } from '@/lib/utils/academic';

export class SubjectService {
  /**
   * Validates if the given academicCycle is valid for the institution's academic structure.
   * Throws an error if invalid.
   */
  static async validateCycleNumber(institutionId: string, academicCycle: number) {
    if (academicCycle < 1) {
      throw new Error('Cycle number must be at least 1');
    }

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
      select: { academicStructure: true }
    });

    if (!institution) {
      throw new Error('Institution not found');
    }

    const structure = institution.academicStructure as any;
    const academic = getAcademicLabel(structure);
    const totalCycles = academic.totalCycles;

    if (academicCycle > totalCycles) {
      throw new Error(`Invalid academicCycle for this tenant's academic structure (Expected ${academic.label} 1 to ${totalCycles})`);
    }

    return true;
  }
}
