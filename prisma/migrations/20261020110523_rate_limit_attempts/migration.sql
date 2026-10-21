-- CreateTable
CREATE TABLE "RateLimitAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "RateLimitAttempt_key_createdAt_idx" ON "RateLimitAttempt"("key", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitAttempt_createdAt_idx" ON "RateLimitAttempt"("createdAt");
