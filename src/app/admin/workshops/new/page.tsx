import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { WorkshopForm } from "@/components/admin/workshop-form";
import { subtleButton } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "New workshop",
};

export default async function NewWorkshopPage() {
  await requireAdmin();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/workshops" className={subtleButton}>
        &larr; Back to workshops
      </Link>
      <div className="mt-3">
        <AdminPageHeader
          eyebrow="New session"
          title="Create workshop"
          description="Save as a draft or publish immediately. Public workshops notify every member on their first publish."
        />
      </div>

      <div className="mt-6">
        <WorkshopForm />
      </div>
    </div>
  );
}
