export const MODULES = {
  DASHBOARD: {
    routes: ["/dashboard"],
    permissions: ["read"],
  },
  ATTENDANCE: {
    routes: ["/dashboard/faculty/attendance"],
    permissions: ["read", "create"],
  },
  ENROLLMENT: {
    routes: ["/dashboard/admin/enrollment"],
    permissions: ["read", "create"],
  },
  NOTICE: {
    routes: ["/dashboard/admin/notice"],
    permissions: ["read", "create"],
  },
} as const;

export const ROLE_PERMISSIONS = {
  ADMIN: {
    DASHBOARD: ["read"],
    ENROLLMENT: ["read", "create"],
    NOTICE: ["read", "create"],
    ATTENDANCE: ["read"],
  },
  FACULTY: {
    DASHBOARD: ["read"],
    ATTENDANCE: ["read", "create"],
    NOTICE: ["read"],
  },
  STUDENT: {
    DASHBOARD: ["read"],
    ATTENDANCE: ["read"],
    NOTICE: ["read"],
  },
} as const;

/* ---------- DERIVED TYPES (THIS IS THE KEY) ---------- */

export type Role = keyof typeof ROLE_PERMISSIONS;
export type ModuleKey = keyof typeof MODULES;
export type Permission =
  (typeof MODULES)[ModuleKey]["permissions"][number];
