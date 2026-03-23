export type AcademicSystem = 'SEMESTER' | 'ANNUAL' | 'YEARLY';

export interface AcademicStructure {
  type: 'SEMESTER' | 'YEARLY';
  totalCycles: number;
}

export function getAcademicLabel(structure: AcademicStructure | AcademicSystem | string) {
  // Handle new JSON structure
  if (typeof structure === 'object' && structure !== null) {
    const isYearly = structure.type === 'YEARLY';
    return {
      label: isYearly ? 'Year' : 'Semester',
      plural: isYearly ? 'Years' : 'Semesters',
      full: isYearly ? 'Yearly System' : 'Semester System',
      totalCycles: structure.totalCycles,
      type: structure.type
    };
  }

  // Handle legacy string/enum
  if (structure === 'ANNUAL' || structure === 'YEARLY') {
    return {
      label: 'Year',
      plural: 'Years',
      full: 'Yearly System',
      totalCycles: 4, // Default for legacy
      type: 'YEARLY'
    };
  }
  
  return {
    label: 'Semester',
    plural: 'Semesters',
    full: 'Semester System',
    totalCycles: 8, // Default for legacy
    type: 'SEMESTER'
  };
}

export function formatCycleLabel(type: 'SEMESTER' | 'YEARLY' | string, cycleNumber: number | string) {
  const label = type === 'YEARLY' ? 'Year' : 'Semester';
  return `${label} ${cycleNumber}`;
}
