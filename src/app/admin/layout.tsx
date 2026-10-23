import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { BrandMark } from "@/components/marketing/brand-mark";
import { requireAdmin } from "@/lib/auth";
import { initials } from "@/lib/format";

export const metadata: Metadata = {
  title: {
    default: "Site administration",
    template: "%s | Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell min-h-dvh text-cream">
      <div className="border-b border-cream/10 bg-navy-deep/60">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-5">
            <BrandMark tone="dark" compact />
            <span className="hidden border-l border-cream/15 pl-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/35 sm:inline">
              Site administration
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex min-h-9 items-center gap-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/45 transition-colors hover:text-gold-soft"
            >
              View site
              <span aria-hidden="true">&#8599;</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex min-h-9 items-center border border-cream/15 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/55 transition-colors hover:border-gold/40 hover:text-gold-soft"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <AdminNav />
              <div className="mt-8 border-t border-cream/10 pt-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center border border-gold/35 font-display text-sm text-gold-soft">
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-cream">
                      {user.name}
                    </p>
                    <p className="truncate text-[10px] text-cream/30">{user.email}</p>
                  </div>
                </div>
                <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold/70">
                  Administrator
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 border border-cream/10 bg-cream/[0.035] p-2 lg:hidden">
              <AdminNav variant="mobile" />
            </div>
            <div className="page-enter">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
