"use client";

import { useActionState } from "react";
import { sendNotificationAction } from "@/actions/notifications";
import {
  inputClass,
  labelClass,
  Notice,
  primaryButton,
  Spinner,
} from "@/components/ui";

export function NotificationForm({
  workshops,
}: {
  workshops: { id: string; title: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    sendNotificationAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? <Notice tone="error">{state.error}</Notice> : null}
      {state?.success ? <Notice tone="success">{state.success}</Notice> : null}

      <div>
        <label htmlFor="title" className={labelClass}>
          Notification title
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={120}
          className={inputClass}
          placeholder="Doors open for the design workshop"
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          maxLength={2000}
          rows={5}
          className={inputClass}
          placeholder="Share the update attendees need to know."
        />
      </div>

      <div>
        <label htmlFor="workshopId" className={labelClass}>
          Related workshop <span className="font-normal text-white/25">(optional)</span>
        </label>
        <select id="workshopId" name="workshopId" className={inputClass} defaultValue="">
          <option value="">General announcement</option>
          {workshops.map((workshop) => (
            <option key={workshop.id} value={workshop.id}>
              {workshop.title}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? (
          <>
            <Spinner />
            Sending...
          </>
        ) : (
          "Send to all members"
        )}
      </button>
    </form>
  );
}
