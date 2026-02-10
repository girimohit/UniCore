import {
  ROLE_PERMISSIONS,
  Role,
  ModuleKey,
  Permission,
} from "./module-role-metadata";

export function canAccess(
  role: Role,
  moduleKey: ModuleKey,
  action: Permission
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role];

  // 🔑 This line fixes the TS error
  if (!(moduleKey in rolePerms)) {
    return false;
  }

  const modulePerms = rolePerms[moduleKey];
  return modulePerms.includes(action);
}
