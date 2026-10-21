"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction, registerAction } from "@/actions/auth";
import {
  buttonBase,
  inputClass,
  labelClass,
  Notice,
  primaryButton,
  Spinner,
} from "@/components/ui";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-3 text-sm font-medium text-rose-300" role="alert">
      {message}
    </p>
  );
}

export function LoginForm({
  next,
  initialMode = "member",
}: {
  next: string;
  initialMode?: "member" | "admin";
}) {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [mode, setMode] = useState<"member" | "admin">(initialMode);
  const isAdmin = mode === "admin";
  const registerHref =
    next === "/dashboard" ? "/register" : `/register?next=${encodeURIComponent(next)}`;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="intent" value={isAdmin ? "admin" : "user"} />

      <div
        className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
        role="group"
        aria-label="Choose sign-in type"
      >
        <button
          type="button"
          onClick={() => setMode("member")}
          aria-pressed={!isAdmin}
          className={`${buttonBase} px-3 py-2 ${
            !isAdmin
              ? "bg-white text-zinc-950 shadow-sm"
              : "text-white/40 hover:bg-white/[0.045] hover:text-white/75"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a8.25 8.25 0 0 1 15 0"
            />
          </svg>
          Attendee
        </button>
        <button
          type="button"
          onClick={() => setMode("admin")}
          aria-pressed={isAdmin}
          className={`${buttonBase} px-3 py-2 ${
            isAdmin
              ? "bg-violet-200 text-zinc-950 shadow-sm"
              : "text-white/40 hover:bg-white/[0.045] hover:text-white/75"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          Administrator
        </button>
      </div>

      {isAdmin ? (
        <Notice tone="info">
          Use an administrator account. Access is verified securely after
          sign-in and opens the control room.
        </Notice>
      ) : null}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
          placeholder="Your password"
        />
      </div>

      <FieldError message={state?.error} />

      <button type="submit" disabled={pending} className={`${primaryButton} w-full py-3`}>
        {pending ? (
          <>
            <Spinner />
            {isAdmin ? "Opening panel..." : "Signing in..."}
          </>
        ) : isAdmin ? (
          "Open admin panel"
        ) : (
          "Sign in"
        )}
      </button>

      {isAdmin ? (
        <p className="text-center text-xs leading-5 text-white/30">
          Administrator accounts are managed by an existing administrator.
        </p>
      ) : (
        <p className="text-center text-sm text-white/40">
          New here?{" "}
          <Link href={registerHref} className="font-medium text-violet-200 hover:text-white">
            Create an account
          </Link>
        </p>
      )}
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(registerAction, null);
  const loginHref =
    next === "/dashboard" ? "/login" : `/login?next=${encodeURIComponent(next)}`;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="name" className={labelClass}>
          Full name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          className={inputClass}
          placeholder="Ada Lovelace"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
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
          Confirm password
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
          placeholder="Repeat your password"
        />
      </div>

      <Notice tone="info">
        Accounts are for attendees. Admin access is assigned by an existing
        administrator.
      </Notice>

      <FieldError message={state?.error} />

      <button type="submit" disabled={pending} className={`${primaryButton} w-full py-3`}>
        {pending ? (
          <>
            <Spinner />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>

      <p className="text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-violet-200 hover:text-white">
          Sign in
        </Link>
      </p>
    </form>
  );
}
