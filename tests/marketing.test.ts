import assert from "node:assert/strict";
import test from "node:test";
import {
  applicationSchema,
  contactSchema,
  experienceLabel,
  revenueLabSchema,
} from "../src/lib/marketing-validation";
import { defaultSiteContent, parseSiteContent } from "../src/lib/site-content";
import {
  isApplicationStatus,
  isEnquiryStatus,
  isRevenueLabStatus,
  statusLabel,
} from "../src/lib/submission-status";

const application = {
  fullName: "Test Applicant",
  email: "TEST@Example.com",
  phone: "",
  currentRole: "",
  company: "",
  experience: "1-3",
  linkedinUrl: "https://www.linkedin.com/in/example",
  motivation:
    "I want to understand how commercial teams build qualified pipeline and turn it into repeatable revenue.",
  consent: true,
};

test("application validation normalizes email and accepts a complete form", () => {
  const result = applicationSchema.safeParse(application);

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.email, "test@example.com");
    assert.equal(result.data.experience, "1-3");
  }
});

test("application validation requires consent and a useful motivation", () => {
  const withoutConsent = applicationSchema.safeParse({
    ...application,
    consent: false,
  });
  const shortMotivation = applicationSchema.safeParse({
    ...application,
    motivation: "Too short",
  });

  assert.equal(withoutConsent.success, false);
  assert.equal(shortMotivation.success, false);
});

test("application validation rejects non-http profile links", () => {
  const result = applicationSchema.safeParse({
    ...application,
    linkedinUrl: "javascript:alert(1)",
  });

  assert.equal(result.success, false);
});

test("contact validation only accepts known topics", () => {
  const valid = contactSchema.safeParse({
    name: "Test Person",
    email: "test@example.com",
    company: "",
    topic: "first-quota",
    message: "I would like to understand the next cohort.",
  });
  const invalid = contactSchema.safeParse({
    name: "Test Person",
    email: "test@example.com",
    company: "",
    topic: "unknown-topic",
    message: "I would like to understand the next cohort.",
  });

  assert.equal(valid.success, true);
  assert.equal(invalid.success, false);
});

test("revenue lab registration requires a name and email", () => {
  const result = revenueLabSchema.safeParse({
    name: "Test Person",
    email: "test@example.com",
  });

  assert.equal(result.success, true);
});

test("submission status guards reject values from other workflows", () => {
  assert.equal(isApplicationStatus("SHORTLISTED"), true);
  assert.equal(isApplicationStatus("ATTENDED"), false);
  assert.equal(isEnquiryStatus("RESPONDED"), true);
  assert.equal(isEnquiryStatus("ACCEPTED"), false);
  assert.equal(isRevenueLabStatus("CANCELLED"), true);
  assert.equal(isRevenueLabStatus("REVIEWING"), false);
  assert.equal(statusLabel("IN_PROGRESS"), "In progress");
});

test("experience labels handle empty and known values", () => {
  assert.equal(experienceLabel(""), "Not provided");
  assert.equal(experienceLabel("5+"), "5+ years");
});

test("site content falls back to safe defaults and validates", () => {
  const parsed = parseSiteContent({});

  assert.deepEqual(parsed, defaultSiteContent);
  assert.equal(
    parseSiteContent({ contact: { email: "hello@example.com" } }).contact.email,
    "hello@example.com",
  );
  assert.equal(
    parseSiteContent({
      dailyWorkshop: {
        title: "Custom Workshop Title",
        meetingLink: "https://zoom.us/j/123456",
        photos: ["https://example.com/photo.jpg"],
      },
    }).dailyWorkshop.title,
    "Custom Workshop Title",
  );
  assert.equal(
    parseSiteContent({
      consultancy: {
        calendlyUrl: "https://calendly.com/test-user/30min",
      },
    }).consultancy.calendlyUrl,
    "https://calendly.com/test-user/30min",
  );
  assert.equal(
    parseSiteContent({
      eventPopup: {
        enabled: true,
        kicker: "SPECIAL SESSION",
        title: "Deal Review Masterclass",
        mode: "custom",
      },
    }).eventPopup.title,
    "Deal Review Masterclass",
  );
  assert.equal(
    parseSiteContent({
      eventPopup: {
        enabled: false,
      },
    }).eventPopup.enabled,
    false,
  );
  assert.equal(
    parseSiteContent({
      eventPopup: {
        mode: "selected",
        selectedWorkshopIds: ["ws-1", "ws-2"],
        showImage: false,
        position: "bottom_right",
      },
    }).eventPopup.position,
    "bottom_right",
  );
  assert.equal(
    parseSiteContent({
      eventPopup: {
        showImage: false,
      },
    }).eventPopup.showImage,
    false,
  );
  assert.deepEqual(
    parseSiteContent({
      eventPopup: {
        mode: "selected",
        selectedWorkshopIds: ["ws-1"],
      },
    }).eventPopup.selectedWorkshopIds,
    ["ws-1"],
  );
});

