import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Refund policy",
  description:
    "How payments, cancellations, and refunds are handled for Hunt n Farm programmes.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund policy"
      intro="This page explains the current position on payments and refunds for Hunt n Farm. No payment is taken through this website."
      updated="23 October 2026"
      sections={[
        {
          title: "This website",
          paragraphs: [
            "The website provides information and accepts applications, enquiries, and Revenue Lab registrations. It does not process card payments or take programme fees.",
          ],
        },
        {
          title: "Revenue Lab",
          paragraphs: [
            "Revenue Lab registration is free. There is no fee to join the weekly workshop or community.",
          ],
        },
        {
          title: "First Quota and paid programmes",
          paragraphs: [
            "Where a programme involves a fee, the fee, payment schedule, cancellation terms, and refund terms are provided in the enrolment information before you commit or pay. Those terms apply to your enrolment.",
            "If you have paid for a programme and have a question about cancellation or a refund, contact the team with the email address used for enrolment.",
          ],
        },
        {
          title: "Statutory rights",
          paragraphs: [
            "Nothing in this policy limits any rights you may have under applicable consumer law. If a term provided at enrolment conflicts with a right you cannot lawfully waive, that right continues to apply.",
          ],
        },
        {
          title: "Questions",
          paragraphs: [
            "If anything about fees, cancellation, or refunds is unclear, ask before you commit. Use the contact page and the team will follow up.",
          ],
        },
      ]}
    />
  );
}
