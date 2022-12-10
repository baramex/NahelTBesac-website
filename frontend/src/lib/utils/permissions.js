export const PERMISSIONS = {
    ALL: 0,
    VIEW_PROFILES: 1,
    EDIT_PROFILES: 2,
    CREATE_PROFILE: 3,
    CREATE_REPORT: 4,
    VIEW_REPORTS: 5,
    VIEW_ROLES: 6
};

export function hasPermission(user, ...permissions) {
    if (!permissions || permissions.length === 0) return true;
    if (!user) return false;
    return permissions.every(p => user.role.permissions?.includes(p)) || user.role.permissions?.includes(PERMISSIONS.ALL);
}