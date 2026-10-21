export type RoleChangeCheck = {
  actorId: string;
  targetId: string;
  targetRole: string;
  nextRole: string;
  adminCount: number;
};

export function roleChangeError({
  actorId,
  targetId,
  targetRole,
  nextRole,
  adminCount,
}: RoleChangeCheck): string | null {
  if (actorId === targetId) {
    return "You cannot change your own role.";
  }

  if (targetRole === nextRole) {
    return null;
  }

  if (targetRole === "ADMIN" && nextRole === "USER" && adminCount <= 1) {
    return "At least one administrator must remain.";
  }

  return null;
}
