import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { AdminPageHeader, AdminStatCard } from "@/components/admin/admin-ui";
import { MemberRoleForm } from "@/components/admin/member-role-form";
import {
  Badge,
  EmptyState,
  inputClass,
  Notice,
  secondaryButton,
  subtleButton,
} from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, initials } from "@/lib/format";

export const metadata: Metadata = {
  title: "Members",
};

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    role?: string | string[];
    notice?: string | string[];
    error?: string | string[];
  }>;
}) {
  const currentUser = await requireAdmin();
  const params = await searchParams;
  const q = first(params.q).slice(0, 100);
  const roleFilter = first(params.role);
  const notice = first(params.notice);
  const error = first(params.error);

  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
    ];
  }

  if (roleFilter === "ADMIN" || roleFilter === "USER") {
    where.role = roleFilter;
  }

  const [members, matchingCount, adminCount, memberCount] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: [{ role: "desc" }, { createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { purchases: { where: { status: "PAID" } } } },
      },
    }),
    db.user.count({ where }),
    db.user.count({ where: { role: "ADMIN" } }),
    db.user.count({ where: { role: "USER" } }),
  ]);

  const hasFilters = Boolean(q || roleFilter);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Audience"
        title="Members"
        description="See who is on the site and decide who can help manage it. Administrator access is checked on every admin request."
      />

      {notice ? (
        <div className="mt-6">
          <Notice tone="success">{notice}</Notice>
        </div>
      ) : null}
      {error ? (
        <div className="mt-6">
          <Notice tone="error">{error}</Notice>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <AdminStatCard
          label="Members"
          value={memberCount.toString()}
          accent="bg-violet-300"
        />
        <AdminStatCard
          label="Administrators"
          value={adminCount.toString()}
          accent="bg-amber-300"
          delay={55}
        />
        <AdminStatCard
          label="People total"
          value={(memberCount + adminCount).toString()}
          accent="bg-emerald-300"
          delay={110}
        />
      </div>

      <form
        method="get"
        className="mt-6 flex flex-col gap-2 rounded-[22px] border border-white/10 bg-[#070708]/85 p-3 shadow-sm sm:flex-row sm:items-center"
      >
        <label htmlFor="member-search" className="sr-only">
          Search members
        </label>
        <input
          id="member-search"
          name="q"
          defaultValue={q}
          className={`${inputClass} sm:max-w-xs`}
          placeholder="Search name or email"
        />
        <label htmlFor="member-role" className="sr-only">
          Filter by role
        </label>
        <select
          id="member-role"
          name="role"
          defaultValue={roleFilter}
          className={`${inputClass} sm:max-w-44`}
        >
          <option value="">All roles</option>
          <option value="ADMIN">Administrators</option>
          <option value="USER">Members</option>
        </select>
        <button type="submit" className={secondaryButton}>
          Apply filters
        </button>
        {hasFilters ? (
          <Link href="/admin/members" className={subtleButton}>
            Clear
          </Link>
        ) : null}
      </form>

      <div className="mt-4 overflow-hidden rounded-[25px] border border-white/10 bg-[#070708]/85 shadow-sm">
        {members.length > 0 ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-3 text-xs text-white/30">
              <span>
                Showing {members.length} of {matchingCount} result
                {matchingCount === 1 ? "" : "s"}
              </span>
              {matchingCount > 100 ? (
                <span>Refine the search to see more.</span>
              ) : null}
            </div>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead className="bg-white/[0.025] text-xs uppercase tracking-wide text-white/30">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Member</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Joined</th>
                    <th className="px-5 py-3 font-semibold">Paid seats</th>
                    <th className="px-5 py-3 font-semibold">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {members.map((member) => {
                    const isSelf = member.id === currentUser.id;
                    const isAdmin = member.role === "ADMIN";

                    return (
                      <tr
                        key={member.id}
                        className="transition-colors hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-200 to-white text-xs font-semibold text-zinc-950">
                              {initials(member.name)}
                            </span>
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 font-medium text-white">
                                {member.name}
                                {isSelf ? <Badge tone="indigo">You</Badge> : null}
                              </p>
                              <p className="truncate text-xs text-white/30">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge tone={isAdmin ? "amber" : "slate"}>
                            {isAdmin ? "Administrator" : "Member"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-white/40">
                          {formatDate(member.createdAt)}
                        </td>
                        <td className="px-5 py-4 text-white/60">
                          {member._count.purchases}
                        </td>
                        <td className="px-5 py-4">
                          {isSelf ? (
                            <span className="text-xs text-white/25">
                              Current account
                            </span>
                          ) : (
                            <MemberRoleForm userId={member.id} role={member.role} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-white/[0.07] xl:hidden">
              {members.map((member) => {
                const isSelf = member.id === currentUser.id;
                const isAdmin = member.role === "ADMIN";

                return (
                  <article key={member.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-200 to-white text-xs font-semibold text-zinc-950">
                        {initials(member.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-medium text-white">
                            {member.name}
                          </p>
                          {isSelf ? <Badge tone="indigo">You</Badge> : null}
                        </div>
                        <p className="truncate text-xs text-white/30">
                          {member.email}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge tone={isAdmin ? "amber" : "slate"}>
                            {isAdmin ? "Administrator" : "Member"}
                          </Badge>
                          <span className="text-xs text-white/30">
                            Joined {formatDate(member.createdAt)} ·{" "}
                            {member._count.purchases} paid
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      {isSelf ? (
                        <p className="text-xs text-white/25">
                          Current account
                        </p>
                      ) : (
                        <MemberRoleForm
                          userId={member.id}
                          role={member.role}
                          fullWidth
                        />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No members found"
              description="Try a different search or role filter to find the account you need."
              action={
                hasFilters ? (
                  <Link href="/admin/members" className={secondaryButton}>
                    Clear filters
                  </Link>
                ) : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
