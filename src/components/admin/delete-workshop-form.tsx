"use client";

import { deleteWorkshopAction } from "@/actions/admin-workshops";
import { dangerButton } from "@/components/ui";

export function DeleteWorkshopForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteWorkshopAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}" permanently?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={dangerButton}>
        Delete
      </button>
    </form>
  );
}
