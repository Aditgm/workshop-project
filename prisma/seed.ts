import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function findOrCreateAdmin(input: {
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    if (existing.role !== "ADMIN") {
      return prisma.user.update({
        where: { id: existing.id },
        data: { role: "ADMIN" },
      });
    }

    return existing;
  }

  return prisma.user.create({
    data: {
      name: "Hunt n Farm Admin",
      email: input.email,
      passwordHash: await hash(input.password, 12),
      role: "ADMIN",
    },
  });
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required to seed the database.",
    );
  }

  const admin = await findOrCreateAdmin({
    email: adminEmail,
    password: adminPassword,
  });

  console.log("Seed complete.");
  console.log(`Admin: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
