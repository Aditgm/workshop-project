"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/actions/account";
import {
  inputClass,
  labelClass,
  Notice,
  primaryButton,
  Spinner,
} from "@/components/ui";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className={labelClass}>
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          maxLength={72}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={72}
          className={inputClass}
          placeholder="At least 10 characters"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={72}
          className={inputClass}
        />
      </div>

      <Notice tone="info">
        Changing your password signs you out of every other browser or device.
      </Notice>

      {state?.error ? (
        <p className="text-sm font-medium text-rose-300" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={`${primaryButton} w-full py-3`}
      >
        {pending ? (
          <>
            <Spinner />
            Updating password...
          </>
        ) : (
          "Update password"
        )}
      </button>
    </form>
  );
}
