import type { Metadata } from "next";
import Link from "next/link";
import { ContentEditor } from "@/components/admin/content-editor";
import { AdminPageHeader, adminPanel } from "@/components/admin/admin-ui";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Site content",
};

export default async function AdminContentPage() {
  const content = await getSiteContent();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Content"
        title="Site content"
        description="The core public copy and contact details. Changes publish immediately."
        actions={
          <Link
            href="/"
            className="inline-flex min-h-10 items-center justify-center rounded-[2px] border border-cream/20 px-4 py-2.5 text-sm font-semibold text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
          >
            View public site &#8599;
          </Link>
        }
      />

      <div className={`${adminPanel} mt-7 p-5 text-xs leading-6 text-cream/45`}>
        <p>
          Editable here: homepage introduction, First Quota details and
          curriculum, Revenue Lab summary, contact details, and the About
          introduction. Programme pages and the legal pages contain static copy
          and should be reviewed before launch.
        </p>
      </div>

      <ContentEditor content={content} />
    </div>
  );
}
