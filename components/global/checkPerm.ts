import { PermType } from "../actions/team";

/**
 * Checks if a user has permission to access a specific project based on the provided permissions.
 *
 * @param {PermType} perms - The permissions object.
 * @param {string} email - The email of the user to check permissions for.
 * @param {string} projectId - The ID of the project to check access for.
 * @returns {boolean} - Returns `true` if the user has permission, otherwise `false`.
 */
export default function CheckPerm(
  perms: PermType,
  email: string,
  projectId: string
): boolean {
  // If `perms.users` is undefined, the user has no permissions
  if (!perms.users) return false;

  // If the user's email is not in the allowed users list, deny access
  if (!perms.users.includes(email)) return false;

  // Find the user's specific permissions
  const userPerm = perms.perms.find((g) => g.email === email);

  // If no specific permissions are found for the user, deny access
  if (!userPerm) return false;

  // If the user has global project access (`projects: true`), allow access
  if (userPerm.projects === true) return true;

  // If the user has access to the specific project, allow access
  if (userPerm.project.includes(projectId)) return true;

  // Otherwise, deny access
  return false;
}

/**
 * Backend version of the permission checker. Ensures the user has access to a specific project.
 *
 * @param {PermType} any - The permissions object.
 * @param {string} email - The email of the user to check permissions for.
 * @param {string} uuid - The UUID of the project to check access for.
 * @returns {boolean} - Returns `true` if the user has permission, otherwise `false`.
 */
export function CheckPermBE(perms: any, email: string, uuid: string): boolean {
  // If the permissions object is empty, deny access
  if (Object.keys(perms as Object).length === 0) return false;

  const perm = perms as PermType;

  // If the user's email is not in the allowed users list, deny access
  if (!perm.users.includes(email)) return false;

  // Find the user's specific permissions
  const userPerm = perm.perms.find((p) => p.email === email);

  // If no specific permissions are found for the user, deny access
  if (!userPerm) return false;

  // If the user does not have global project access and does not have access to the specific project, deny access
  if (!userPerm.projects && !userPerm.project.includes(uuid)) {
    return false;
  }

  // Otherwise, allow access
  return true;
}

/**
 * Chech the user have permission and it is admin
 *
 * @param {PermType} any - The permissions object.
 * @param {string} email - The email of the user to check permissions for.
 * @returns {boolean} - Returns `true` if the user has permission, otherwise `false`.
 */
export function checkIsAdmin(perms:any,email:string){
  // If the permissions object is empty, deny access
  if (Object.keys(perms as Object).length === 0) return false;
  const perm = perms as PermType;

  // If the user's email is not in the allowed users list, deny access
  if (!perm.users.includes(email)) return false;
  // Otherwise, allow access
  return true;
}