import { db } from "@/lib/db";

export async function getPaidWorkshopIds(userId: string): Promise<Set<string>> {
  const purchases = await db.workshopPurchase.findMany({
    where: { userId, status: "PAID" },
    select: { workshopId: true },
  });

  return new Set(purchases.map((purchase) => purchase.workshopId));
}

export async function markPurchasePaidByIdentifier(params: {
  purchaseId?: string | null;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
}) {
  const { purchaseId, stripeSessionId, stripePaymentIntentId } = params;

  if (!purchaseId && !stripeSessionId) return null;

  const purchase = await db.workshopPurchase.findFirst({
    where: {
      OR: [
        ...(purchaseId ? [{ id: purchaseId }] : []),
        ...(stripeSessionId ? [{ stripeSessionId }] : []),
      ],
    },
  });

  if (!purchase) return null;

  if (purchase.status === "PAID") {
    return purchase;
  }

  return db.workshopPurchase.update({
    where: { id: purchase.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      stripePaymentIntentId: stripePaymentIntentId ?? purchase.stripePaymentIntentId,
    },
  });
}

export async function expirePendingPurchaseBySessionId(
  stripeSessionId: string,
): Promise<void> {
  await db.workshopPurchase.updateMany({
    where: { stripeSessionId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

export async function refundPurchaseByPaymentIntentId(
  paymentIntentId: string,
): Promise<void> {
  await db.workshopPurchase.updateMany({
    where: { stripePaymentIntentId: paymentIntentId, status: "PAID" },
    data: { status: "REFUNDED" },
  });
}
