import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Website terms",
  description: "The terms that apply to use of the Hunt n Farm website.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Website terms"
      intro="These terms apply to your use of the Hunt n Farm website. By using the site, you agree to use it lawfully and responsibly."
      updated="23 October 2026"
      sections={[
        {
          title: "Website use",
          paragraphs: [
            "You may use this website for lawful purposes connected with learning about Hunt n Farm, its programmes, its advisory work, and its community.",
            "You must not attempt to interfere with the site, access restricted areas without permission, submit misleading information, or use the site in a way that harms other people or the service.",
          ],
        },
        {
          title: "Programme information and applications",
          paragraphs: [
            "Programme descriptions, dates, fees, and availability may change. Information on this site is provided for general guidance and is confirmed during the application or enrolment process.",
            "Submitting an application or registering interest does not create a contract, guarantee a place in a cohort, or guarantee any particular outcome.",
          ],
        },
        {
          title: "No employment or placement guarantee",
          paragraphs: [
            "Hunt n Farm does not guarantee employment, job interviews, placements, or offers. Placement support is subject to eligibility and scope, and outcomes depend on factors including the participant, the market, and the role.",
          ],
        },
        {
          title: "Payments",
          paragraphs: [
            "This website does not currently take programme payments. Any fees, payment terms, cancellation terms, and refund terms are provided separately before you commit to a paid programme.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "The content, design, and materials on this website belong to Hunt n Farm or are used with permission. You may use the site for personal, non-commercial purposes. You may not reproduce or redistribute substantial content without permission.",
          ],
        },
        {
          title: "Third-party links",
          paragraphs: [
            "The site may link to third-party websites or services. We do not control those services and are not responsible for their content, availability, or privacy practices.",
          ],
        },
        {
          title: "Liability",
          paragraphs: [
            "The website is provided on an as-is basis to the extent permitted by law. We do not warrant that the site will always be available, complete, or error-free. Nothing in these terms excludes liability that cannot lawfully be excluded.",
          ],
        },
        {
          title: "Changes and contact",
          paragraphs: [
            "We may update these terms as the service develops. The latest version will be published on this page. If you have a question, contact the team using the contact page.",
          ],
        },
      ]}
    />
  );
}
