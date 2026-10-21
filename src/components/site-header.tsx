import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { getSessionUser } from "@/lib/auth";
import { initials } from "@/lib/format";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { primaryButton, subtleButton } from "@/components/ui";

export async function SiteHeader() {
  const user = await getSessionUser();
  const unread = user
    ? await getUnreadNotificationCount(user.id, user.createdAt)
    : 0;

  const navLinks = (
    <>
      <Link href="/" className={`${subtleButton} text-[13px]`}>
        Workshops
      </Link>
      {user ? (
        <Link href="/dashboard" className={`${subtleButton} text-[13px]`}>
          Dashboard
        </Link>
      ) : null}
      {user?.role === "ADMIN" ? (
        <Link href="/admin" className={`${subtleButton} text-[13px]`}>
          Admin
        </Link>
      ) : null}
    </>
  );

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="site-nav-shell mx-auto max-w-[1280px] rounded-[26px] px-3 py-2 sm:rounded-full sm:px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-full pr-2"
            aria-label="Workshop Hub home"
          >
            <span className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 text-zinc-950 shadow-[0_0_24px_rgba(196,181,253,0.18)] transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none">
              <span className="text-[11px] font-bold tracking-[-0.08em]">WH</span>
            </span>
            <span className="hidden text-sm font-medium tracking-[-0.025em] text-white sm:inline">
              Workshop Hub
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-0.5 lg:flex">
            {navLinks}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
            {user ? (
              <>
                <Link
                  href="/dashboard#notifications"
                  className="group relative inline-flex size-9 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.055] hover:text-white"
                  aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="size-[18px] transition-transform duration-200 ease-out group-hover:-rotate-6 motion-reduce:transform-none"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.084 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>
                  {unread > 0 ? (
                    <span className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-violet-300 px-1 text-[9px] font-bold leading-4 text-zinc-950 ring-2 ring-black">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </Link>

                <Link
                  href="/account"
                  aria-label={`Account settings for ${user.name}`}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] py-1 pl-1 pr-2.5 text-sm font-medium text-white/75 transition-[transform,border-color,background-color] duration-200 ease-out hover:-translate-y-px hover:border-white/20 hover:bg-white/[0.06] motion-reduce:transform-none"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-violet-200 to-white text-[10px] font-bold text-zinc-950">
                    {initials(user.name)}
                  </span>
                  <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
                </Link>

                <form action={logoutAction} className="hidden md:block">
                  <button type="submit" className={`${subtleButton} text-[13px]`}>
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <span className="hidden sm:block">
                  <Link href="/login" className={`${subtleButton} text-[13px]`}>
                    Log in
                  </Link>
                </span>
                <Link href="/register" className={`${primaryButton} px-4 py-2`}>
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Create account</span>
                  <span className="grid size-5 place-items-center rounded-full bg-zinc-950 text-[10px] text-white">
                    <span aria-hidden="true">&#8599;</span>
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-0.5 overflow-x-auto border-t border-white/[0.06] px-0.5 pt-2 lg:hidden">
          {navLinks}
          {user ? (
            <form action={logoutAction} className="ml-auto md:hidden">
              <button type="submit" className={`${subtleButton} whitespace-nowrap text-[13px]`}>
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className={`${subtleButton} ml-auto whitespace-nowrap text-[13px] sm:hidden`}
            >
              Log in
            </Link>
          )}
        </div>
        <span className="site-nav-sheen" aria-hidden="true" />
      </div>
    </header>
  );
}
