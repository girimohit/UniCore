export type AcademicSystem = 'SEMESTER' | 'ANNUAL';

export function getAcademicLabel(system: AcademicSystem | string) {
  if (system === 'ANNUAL') {
    return {
      label: 'Year',
      plural: 'Years',
      full: 'Annual System'
    };
  }
  return {
    label: 'Semester',
    plural: 'Semesters',
    full: 'Semester System'
  };
}
