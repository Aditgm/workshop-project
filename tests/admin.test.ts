import assert from "node:assert/strict";
import test from "node:test";
import { roleChangeError } from "../src/lib/admin";

const base = {
  actorId: "admin_1",
  targetId: "member_1",
  targetRole: "USER",
  nextRole: "ADMIN",
  adminCount: 2,
};

test("administrators cannot change their own role", () => {
  assert.equal(
    roleChangeError({ ...base, targetId: "admin_1", targetRole: "ADMIN" }),
    "You cannot change your own role.",
  );
});

test("the last administrator cannot be demoted", () => {
  assert.equal(
    roleChangeError({
      ...base,
      targetRole: "ADMIN",
      nextRole: "USER",
      adminCount: 1,
    }),
    "At least one administrator must remain.",
  );
});

test("administrators can be demoted when another admin remains", () => {
  assert.equal(
    roleChangeError({
      ...base,
      targetRole: "ADMIN",
      nextRole: "USER",
      adminCount: 2,
    }),
    null,
  );
});

test("members can be promoted by another administrator", () => {
  assert.equal(roleChangeError(base), null);
});
