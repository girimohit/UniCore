export type ModuleType = 'CORE' | 'OPTIONAL';

export interface ModuleMetadata {
  id: string; // e.g., 'attendance'
  name: string; // e.g., 'Attendance Management'
  description: string;
  type: ModuleType;
  icon?: string; // lucide-react icon name string
  routePath: string; // e.g., '/attendance' (relative to tenant base path)
  dependencies?: string[]; // IDs of other modules required to run this one
  defaultEnabled: boolean;
}

// System-wide absolute registry of all known modules in the codebase.
// This allows the dynamic loader and DB seeder to know exactly what exists.
export const SYSTEM_MODULES: Record<string, ModuleMetadata> = {
  departments: {
    id: 'departments',
    name: 'Departments',
    description: 'Manage institutional departments',
    type: 'CORE',
    icon: 'Building',
    routePath: '/departments',
    defaultEnabled: true,
  },
  courses: {
    id: 'courses',
    name: 'Courses',
    description: 'Manage academic courses',
    type: 'CORE',
    icon: 'BookOpen',
    routePath: '/courses',
    defaultEnabled: true,
    dependencies: ['departments']
  },
  attendance: {
    id: 'attendance',
    name: 'Attendance',
    description: 'Track student and faculty attendance',
    type: 'CORE',
    icon: 'CheckSquare',
    routePath: '/attendance',
    defaultEnabled: true,
    dependencies: ['courses']
  },
  library: {
    id: 'library',
    name: 'Library Management',
    description: 'Catalogue and book issuing system',
    type: 'OPTIONAL',
    icon: 'Library',
    routePath: '/library',
    defaultEnabled: false,
  },
  // Add additional modules here
};
