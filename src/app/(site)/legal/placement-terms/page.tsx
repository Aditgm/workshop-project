import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Placement terms",
  description:
    "The scope and boundaries of placement support for First Quota participants.",
};

export default function PlacementTermsPage() {
  return (
    <LegalPage
      title="Placement terms"
      intro="These terms explain the boundaries of placement support. They are intended to prevent ambiguity: placement support is support, not a promise of employment."
      updated="23 October 2026"
      sections={[
        {
          title: "No guarantee",
          paragraphs: [
            "Hunt n Farm does not guarantee employment, job interviews, placements, offers, or any particular career outcome. Any support provided is subject to the participant, the market, the role, and factors outside our control.",
          ],
        },
        {
          title: "Eligibility and scope",
          paragraphs: [
            "Placement support is not automatic for every applicant. Eligibility, timing, and the specific scope are discussed as part of the First Quota application or cohort process. Availability may vary.",
            "Support may include help with positioning, preparation for relevant conversations, and guidance on approaching the market. It does not include making decisions on your behalf or acting as your employer or recruiter.",
          ],
        },
        {
          title: "Participant responsibilities",
          paragraphs: [
            "Participants are responsible for their own applications, decisions, communications, and conduct. You should provide accurate information and treat employers, interviewers, and other participants with respect.",
          ],
        },
        {
          title: "Changes",
          paragraphs: [
            "We may adjust the scope or availability of placement support between cohorts. The terms that apply to your cohort are confirmed during the application or enrolment process.",
          ],
        },
        {
          title: "Questions",
          paragraphs: [
            "If you are unsure whether placement support applies to you, ask before you apply. Use the contact page and the team will follow up.",
          ],
        },
      ]}
    />
  );
}
