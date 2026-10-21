import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function daysFromNow(days: number, hour = 18) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const memberEmail = (process.env.SEED_MEMBER_EMAIL ?? "member@example.com").toLowerCase();
  const memberPassword = process.env.SEED_MEMBER_PASSWORD ?? "Member123!";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Workshop Admin",
      passwordHash: await hash(adminPassword, 12),
      role: "ADMIN",
    },
    create: {
      name: "Workshop Admin",
      email: adminEmail,
      passwordHash: await hash(adminPassword, 12),
      role: "ADMIN",
    },
  });

  const member = await prisma.user.upsert({
    where: { email: memberEmail },
    update: {
      name: "Sample Member",
      passwordHash: await hash(memberPassword, 12),
      role: "USER",
    },
    create: {
      name: "Sample Member",
      email: memberEmail,
      passwordHash: await hash(memberPassword, 12),
      role: "USER",
    },
  });

  const publicWorkshop = await prisma.workshop.upsert({
    where: { slug: "intro-to-system-design" },
    update: {},
    create: {
      slug: "intro-to-system-design",
      title: "Intro to System Design",
      summary:
        "A free, practical walkthrough of how to design reliable services from first principles.",
      description:
        "Join us for a hands-on introduction to system design. We will cover requirements gathering, capacity estimation, data modeling, caching, and trade-off analysis.\n\nWho is this for? Developers preparing for design interviews or moving into senior engineering roles. Bring questions; the last 20 minutes are an open Q&A.",
      type: "PUBLIC",
      priceCents: 0,
      startsAt: daysFromNow(7),
      endsAt: daysFromNow(7, 20),
      location: "Online",
      meetingUrl: "https://meet.example.com/intro-to-system-design",
      published: true,
      notificationSentAt: new Date(),
    },
  });

  await prisma.workshop.upsert({
    where: { slug: "production-nextjs-workshop" },
    update: {},
    create: {
      slug: "production-nextjs-workshop",
      title: "Shipping Next.js to Production",
      summary:
        "A small-group, paid workshop covering authentication, payments, observability, and deployment.",
      description:
        "This private workshop is limited to 25 participants. We will build and deploy a production-ready Next.js application, review real incident postmortems, and run a live code review.\n\nAccess details are emailed after payment and are also available from your dashboard.",
      type: "PRIVATE",
      priceCents: 4900,
      startsAt: daysFromNow(14),
      endsAt: daysFromNow(14, 21),
      location: "Online",
      meetingUrl: "https://meet.example.com/production-nextjs",
      capacity: 25,
      published: true,
      notificationSentAt: new Date(),
    },
  });

  const existingNotification = await prisma.notification.findFirst({
    where: { workshopId: publicWorkshop.id },
  });

  if (!existingNotification) {
    await prisma.notification.create({
      data: {
        title: `New public workshop: ${publicWorkshop.title}`,
        message:
          "A new free workshop is open for registration. View the details and reserve your spot.",
        workshopId: publicWorkshop.id,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin:  ${admin.email} / ${adminPassword}`);
  console.log(`Member: ${member.email} / ${memberPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
