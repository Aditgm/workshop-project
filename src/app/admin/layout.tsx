import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Badge, subtleButton } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { initials } from "@/lib/format";

export const metadata: Metadata = {
  title: {
    default: "Admin control room",
    template: "%s | Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-3">
            <div className="glass-panel overflow-hidden rounded-[25px] p-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-white via-zinc-200 to-zinc-500 text-[11px] font-bold tracking-[-0.06em] text-zinc-950">
                  WH
                </span>
                <div>
                  <p className="text-sm font-medium tracking-[-0.02em] text-white">
                    Workshop Hub
                  </p>
                  <p className="text-[11px] text-white/30">Control room</p>
                </div>
              </div>

              <div className="mt-3 border-t border-white/[0.07] pt-2">
                <AdminNav />
              </div>

              <div className="mt-3 space-y-1 border-t border-white/[0.07] pt-3">
                <Link href="/" className={subtleButton}>
                  <span className="flex w-full items-center justify-between gap-3">
                    View public site
                    <span aria-hidden="true">&#8599;</span>
                  </span>
                </Link>
                <Link href="/dashboard" className={subtleButton}>
                  <span className="flex w-full items-center gap-3">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12l8.954-8.955a1.126 1.126 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.875h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
                      />
                    </svg>
                    My dashboard
                  </span>
                </Link>
              </div>
            </div>

            <div className="glass-panel rounded-[25px] p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-violet-200 to-white text-[11px] font-semibold text-zinc-950">
                  {initials(user.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] text-white/30">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                <Badge tone="amber">Administrator</Badge>
                <Link
                  href="/account"
                  className="text-[11px] font-medium text-violet-200 hover:text-white"
                >
                  Account
                </Link>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 rounded-[22px] border border-white/10 bg-[#070708]/85 p-2 backdrop-blur-sm lg:hidden">
            <AdminNav variant="mobile" />
          </div>

          <div className="page-enter">{children}</div>
        </div>
      </div>
    </div>
  );
}
