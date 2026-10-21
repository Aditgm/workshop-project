import { updateMemberRoleAction } from "@/actions/admin-members";
import { SubmitButton } from "@/components/submit-button";
import { secondaryButton } from "@/components/ui";

export function MemberRoleForm({
  userId,
  role,
  fullWidth = false,
}: {
  userId: string;
  role: string;
  fullWidth?: boolean;
}) {
  const isAdmin = role === "ADMIN";
  const nextRole = isAdmin ? "USER" : "ADMIN";

  return (
    <form action={updateMemberRoleAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="role" value={nextRole} />
      <SubmitButton
        className={fullWidth ? `${secondaryButton} w-full` : secondaryButton}
        pendingLabel="Updating..."
      >
        {isAdmin ? "Remove admin" : "Make admin"}
      </SubmitButton>
    </form>
  );
}
