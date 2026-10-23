-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_workshopId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationRead" DROP CONSTRAINT "NotificationRead_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationRead" DROP CONSTRAINT "NotificationRead_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkshopPurchase" DROP CONSTRAINT "WorkshopPurchase_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkshopPurchase" DROP CONSTRAINT "WorkshopPurchase_workshopId_fkey";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "NotificationRead";

-- DropTable
DROP TABLE "Workshop";

-- DropTable
DROP TABLE "WorkshopPurchase";
