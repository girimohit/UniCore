export type Permission = | "read" | "create" | "update" | "delete";

export interface ModuleMeta {
    key: string,
    rolesAllowed: string[],
    permissions: Permission[],
}

export const MODULES: Record<string, ModuleMeta> = {
    TENANT: {
        key: "TENANT",
        rolesAllowed: ["Admin"],
        permissions: ["read", "create", "update"],
    },

    USER: {
        key: "USER",
        rolesAllowed: ["Admin"],
        permissions: ["read", "create", "update"],
    },

    COURSE: {
        key: "COURSE",
        rolesAllowed: ["Admin", "Teacher"],
        permissions: ["read", "create", "update"],
    },

    STUDENT: {
        key: "STUDENT",
        rolesAllowed: ["Admin", "Teacher"],
        permissions: ["read", "create", "update"],
    },

    ATTENDANCE: {
        key: "ATTENDANCE",
        rolesAllowed: ["Teacher", "Admin"],
        permissions: ["read", "create", "update"],
    },

    EXAM: {
        key: "EXAM",
        rolesAllowed: ["Admin", "Faculty", "Principal", "Student"],
        permissions: ["read", "create", "update"],
    },

    FEES: {
        key: "FEES",
        rolesAllowed: ["Admin", "Student"],
        permissions: ["read", "create", "update"],
    },

    NOTICES: {
        key: "NOTICES",
        rolesAllowed: ["Admin", "Faculty", "Student"],
        permissions: ["read", "create", "update"],
    },

    TIMETABLE: {
        key: "TIMETABLE",
        rolesAllowed: ["Admin", "Faculty", "Student"],
        permissions: ["read", "create", "update"],
    },
}