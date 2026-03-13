import { ModuleMetadata } from '@/lib/modules/registry';

/**
 * Self-contained configuration for the Attendance Module.
 * This can be used to dynamically load UI components or specific routes
 * associated solely with this Module boundary.
 */
export const AttendanceModuleConfig: ModuleMetadata = {
  id: 'attendance',
  name: 'Attendance',
  description: 'Track student and faculty attendance',
  type: 'CORE',
  icon: 'CheckSquare',
  routePath: '/attendance',
  defaultEnabled: true,
  dependencies: ['courses']
};

export default AttendanceModuleConfig;
