"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import {
  fieldInput,
  fieldLabel,
  primaryButton,
} from "@/components/marketing/marketing-ui";
import { FormState } from "@/components/marketing/form-parts";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="grid gap-5">
      <div>
        <label htmlFor="login-email" className={fieldLabel}>
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className={fieldInput}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="login-password" className={fieldLabel}>
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          maxLength={72}
          autoComplete="current-password"
          className={fieldInput}
          placeholder="Your password"
        />
      </div>

      <FormState state={state} />

      <SubmitButton
        pendingLabel="Opening admin..."
        className={`${primaryButton} w-full`}
      >
        Open admin
        <span aria-hidden="true">&#8599;</span>
      </SubmitButton>
    </form>
  );
}
