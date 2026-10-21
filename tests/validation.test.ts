import assert from "node:assert/strict";
import test from "node:test";
import {
  changePasswordSchema,
  notificationSchema,
  parseDollarsToCents,
  workshopSchema,
} from "../src/lib/validation";

const baseWorkshop = {
  title: "Reliable API Design",
  slug: "reliable-api-design",
  summary: "A practical workshop about designing dependable APIs.",
  description:
    "In this session we will cover contracts, error handling, versioning, and observability.",
  startsAt: "2026-12-01T18:00",
  endsAt: "2026-12-01T20:00",
  location: "Online",
  meetingUrl: "https://meet.example.com/reliable-api-design",
  capacity: "30",
  coverImageUrl: "",
  published: true,
};

test("dollar input is converted to integer cents", () => {
  assert.equal(parseDollarsToCents("49"), 4900);
  assert.equal(parseDollarsToCents("49.99"), 4999);
  assert.equal(parseDollarsToCents("0.50"), 50);
  assert.equal(parseDollarsToCents("12.345"), null);
  assert.equal(parseDollarsToCents("-4"), null);
});

test("public workshops are valid at zero price", () => {
  const parsed = workshopSchema.safeParse({
    ...baseWorkshop,
    type: "PUBLIC",
    price: "0",
  });
  assert.equal(parsed.success, true);
});

test("private workshops require at least one dollar", () => {
  const free = workshopSchema.safeParse({
    ...baseWorkshop,
    type: "PRIVATE",
    price: "0",
  });
  const paid = workshopSchema.safeParse({
    ...baseWorkshop,
    type: "PRIVATE",
    price: "49.00",
  });

  assert.equal(free.success, false);
  assert.equal(paid.success, true);
});

test("workshop end time must be after the start time", () => {
  const parsed = workshopSchema.safeParse({
    ...baseWorkshop,
    type: "PUBLIC",
    price: "0",
    startsAt: "2026-12-01T20:00",
    endsAt: "2026-12-01T18:00",
  });

  assert.equal(parsed.success, false);
});

test("workshop links must use http or https", () => {
  const parsed = workshopSchema.safeParse({
    ...baseWorkshop,
    type: "PUBLIC",
    price: "0",
    meetingUrl: "javascript:alert(1)",
  });

  assert.equal(parsed.success, false);
});

test("password changes require matching, sufficiently long passwords", () => {
  const valid = changePasswordSchema.safeParse({
    currentPassword: "OldPassword123!",
    password: "NewPassword123!",
    confirmPassword: "NewPassword123!",
  });
  const mismatched = changePasswordSchema.safeParse({
    currentPassword: "OldPassword123!",
    password: "NewPassword123!",
    confirmPassword: "DifferentPassword123!",
  });
  const short = changePasswordSchema.safeParse({
    currentPassword: "OldPassword123!",
    password: "short",
    confirmPassword: "short",
  });

  assert.equal(valid.success, true);
  assert.equal(mismatched.success, false);
  assert.equal(short.success, false);
});

test("notification validation rejects empty messages", () => {
  const valid = notificationSchema.safeParse({
    title: "Schedule update",
    message: "The session now starts thirty minutes later.",
    workshopId: "",
  });
  const invalid = notificationSchema.safeParse({
    title: "Schedule update",
    message: "",
    workshopId: "",
  });

  assert.equal(valid.success, true);
  assert.equal(invalid.success, false);
});
