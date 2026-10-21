import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { clearRateLimit, consumeRateLimit } from "../src/lib/rate-limit";

const scope = "test-rate-limit";
const identifier = `subject-${randomUUID()}`;

test("rate limiting blocks attempts beyond the window limit", async () => {
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await consumeRateLimit({
        scope,
        identifier,
        limit: 3,
        windowSeconds: 60,
      });
      assert.equal(result.allowed, true);
    }

    const blocked = await consumeRateLimit({
      scope,
      identifier,
      limit: 3,
      windowSeconds: 60,
    });

    assert.equal(blocked.allowed, false);
    if (!blocked.allowed) {
      assert.ok(blocked.retryAfterSeconds > 0);
      assert.ok(blocked.retryAfterSeconds <= 60);
    }
  } finally {
    await clearRateLimit(scope, identifier);
  }
});

test("clearing a rate limit allows the identifier again", async () => {
  const freshIdentifier = `subject-${randomUUID()}`;

  try {
    await consumeRateLimit({
      scope,
      identifier: freshIdentifier,
      limit: 1,
      windowSeconds: 60,
    });
    await clearRateLimit(scope, freshIdentifier);

    const result = await consumeRateLimit({
      scope,
      identifier: freshIdentifier,
      limit: 1,
      windowSeconds: 60,
    });

    assert.equal(result.allowed, true);
  } finally {
    await clearRateLimit(scope, freshIdentifier);
  }
});
