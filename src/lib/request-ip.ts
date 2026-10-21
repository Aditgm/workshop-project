import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip")?.trim();

  return address || "unknown";
}
