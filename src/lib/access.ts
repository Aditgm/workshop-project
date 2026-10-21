export const WORKSHOP_TYPES = ["PUBLIC", "PRIVATE"] as const;
export type WorkshopType = (typeof WORKSHOP_TYPES)[number];

export const ROLES = ["USER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export type Viewer = { id: string; role: string } | null;

export type AccessWorkshop = {
  published: boolean;
  type: string;
};

export function isAdmin(viewer: Viewer): boolean {
  return viewer?.role === "ADMIN";
}

export function canViewWorkshop(workshop: AccessWorkshop, viewer: Viewer): boolean {
  return workshop.published || isAdmin(viewer);
}

export function canAccessJoinLink(
  workshop: AccessWorkshop,
  viewer: Viewer,
  hasPaidAccess: boolean,
): boolean {
  if (!workshop.published || !viewer) return false;
  if (isAdmin(viewer)) return true;
  if (workshop.type === "PUBLIC") return true;
  return hasPaidAccess;
}

export function canPurchaseWorkshop(
  workshop: AccessWorkshop,
  viewer: Viewer,
  hasPaidAccess: boolean,
): boolean {
  return (
    workshop.published &&
    workshop.type === "PRIVATE" &&
    viewer !== null &&
    !isAdmin(viewer) &&
    !hasPaidAccess
  );
}

export function isWorkshopType(value: string): value is WorkshopType {
  return (WORKSHOP_TYPES as readonly string[]).includes(value);
}

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
