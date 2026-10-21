"use client";

import { deleteNotificationAction } from "@/actions/notifications";
import { dangerButton } from "@/components/ui";

export function DeleteNotificationForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteNotificationAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the announcement "${title}"?`)) {
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
