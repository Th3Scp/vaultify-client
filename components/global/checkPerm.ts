export default function CheckPerm(
  perms: any,
  email: string,
  projectId: string
) {
  if (perms.users === undefined) return false;

  if (!perms.users.includes(email)) return false;

  const userPerm = perms.perms.filter((g: any) => g.email === email)[0];

  if (userPerm === undefined) return false;
  if (userPerm.projects === true) return true;
  if (userPerm.project.includes(projectId)) return true;
  return false;
}
