import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export async function SiteFooter() {
  const user = await getSessionUser();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-black/45">
      <div
        className="pointer-events-none absolute -right-32 -top-48 size-[32rem] rounded-full bg-violet-500/[0.09] blur-[110px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1280px] px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.55fr_0.55fr] lg:gap-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 text-[11px] font-bold tracking-[-0.08em] text-zinc-950">
                WH
              </span>
              <span className="text-sm font-medium tracking-[-0.02em] text-white">
                Workshop Hub
              </span>
            </Link>
            <p className="mt-8 max-w-lg text-5xl font-semibold leading-[0.92] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
              Learn together.
              <span className="block text-zinc-600">Go further.</span>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-6 text-white/40">
              Free community sessions and focused small-group workshops, with
              clear details and secure access from day one.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/30">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/55">
              <Link href="/" className="w-fit transition-colors hover:text-white">
                All workshops
              </Link>
              <Link
                href="/dashboard"
                className="w-fit transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              {user?.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="w-fit transition-colors hover:text-white"
                >
                  Admin control room
                </Link>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/30">
              Account
            </p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/55">
              {user ? (
                <Link
                  href="/account"
                  className="w-fit transition-colors hover:text-white"
                >
                  Account settings
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-fit transition-colors hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="w-fit transition-colors hover:text-white"
                  >
                    Create account
                  </Link>
                </>
              )}
              <Link
                href="/register"
                className="w-fit transition-colors hover:text-white"
              >
                Join a workshop
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Workshop Hub. All rights reserved.</p>
          <p>Focused learning. Real access. No noise.</p>
        </div>
      </div>
    </footer>
  );
}
