import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Hunt n Farm collects, uses, and protects information submitted through the website.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro="This policy explains how Hunt n Farm handles personal information submitted through this website. It applies to applications, contact enquiries, and Revenue Lab registrations."
      updated="23 October 2026"
      sections={[
        {
          title: "Information you provide",
          paragraphs: [
            "When you submit an application, contact enquiry, or Revenue Lab registration, we collect the details you enter. This may include your name, email address, phone number, current role, company, experience, profile links, and the content of your message or application.",
            "Please do not include sensitive personal information in free-text fields unless it is necessary for your enquiry.",
          ],
        },
        {
          title: "Information created automatically",
          paragraphs: [
            "The hosting and infrastructure that run this website may process basic technical information such as request logs, IP address, browser type, and timestamps. This information is used to operate, secure, and troubleshoot the site.",
            "The public website does not currently include advertising trackers or third-party analytics scripts. Essential cookies may be used to support administrator sign-in and security.",
          ],
        },
        {
          title: "How we use information",
          paragraphs: [
            "We use submitted information to review applications, respond to enquiries, manage Revenue Lab registrations, and communicate about the programmes or services you have asked about.",
            "We do not sell personal information. We do not use application or enquiry details for unrelated marketing without a lawful basis or your consent where required.",
          ],
        },
        {
          title: "Service providers",
          paragraphs: [
            "We rely on service providers for website hosting, database infrastructure, and related technical operations. Those providers process information on our behalf and are expected to apply appropriate safeguards.",
          ],
        },
        {
          title: "Retention",
          paragraphs: [
            "We keep information for as long as needed for the purpose it was collected, for reasonable operational records, or to meet legal obligations. If you want us to delete information you have submitted, contact us and we will review the request.",
          ],
        },
        {
          title: "Your choices and rights",
          paragraphs: [
            "Depending on where you live, you may have rights to access, correct, delete, or restrict the use of your personal information. To make a request, contact the team using the contact page.",
            "You can also ask to stop receiving communications from us at any time.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "For privacy questions or requests, use the contact form. The team will follow up using the details you provide.",
          ],
        },
      ]}
    />
  );
}
