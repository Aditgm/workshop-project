import assert from "node:assert/strict";
import test from "node:test";
import {
  canAccessJoinLink,
  canPurchaseWorkshop,
  canViewWorkshop,
  isAdmin,
} from "../src/lib/access";

const member = { id: "user_1", role: "USER" };
const admin = { id: "admin_1", role: "ADMIN" };

test("draft workshops are hidden from members but visible to admins", () => {
  const draft = { published: false, type: "PUBLIC" };
  assert.equal(canViewWorkshop(draft, member), false);
  assert.equal(canViewWorkshop(draft, null), false);
  assert.equal(canViewWorkshop(draft, admin), true);
});

test("published workshops are visible to everyone", () => {
  assert.equal(canViewWorkshop({ published: true, type: "PUBLIC" }, null), true);
  assert.equal(canViewWorkshop({ published: true, type: "PRIVATE" }, member), true);
});

test("public access links require a signed-in viewer", () => {
  const workshop = { published: true, type: "PUBLIC" };
  assert.equal(canAccessJoinLink(workshop, null, false), false);
  assert.equal(canAccessJoinLink(workshop, member, false), true);
});

test("private access links require paid access", () => {
  const workshop = { published: true, type: "PRIVATE" };
  assert.equal(canAccessJoinLink(workshop, member, false), false);
  assert.equal(canAccessJoinLink(workshop, member, true), true);
  assert.equal(canAccessJoinLink(workshop, null, true), false);
});

test("admins can open published workshop links without a purchase", () => {
  assert.equal(
    canAccessJoinLink({ published: true, type: "PRIVATE" }, admin, false),
    true,
  );
  assert.equal(canAccessJoinLink({ published: false, type: "PRIVATE" }, admin, false), false);
});

test("only signed-in members without access can purchase private workshops", () => {
  const workshop = { published: true, type: "PRIVATE" };
  assert.equal(canPurchaseWorkshop(workshop, null, false), false);
  assert.equal(canPurchaseWorkshop(workshop, member, false), true);
  assert.equal(canPurchaseWorkshop(workshop, member, true), false);
  assert.equal(canPurchaseWorkshop(workshop, admin, false), false);
  assert.equal(
    canPurchaseWorkshop({ published: true, type: "PUBLIC" }, member, false),
    false,
  );
});

test("admin detection is role-based", () => {
  assert.equal(isAdmin(admin), true);
  assert.equal(isAdmin(member), false);
  assert.equal(isAdmin(null), false);
});
