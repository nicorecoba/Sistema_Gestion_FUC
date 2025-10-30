import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Club demo (id 1)
  const club = await prisma.club.upsert({
    where: { name: "Club Nautico Demo" },
    update: {},
    create: { name: "Club Nautico Demo" }
  });

  // Admin demo
  await prisma.user.upsert({
    where: { email: "admin@fuc.test" },
    update: {},
    create: {
      email: "admin@fuc.test",
      name: "Admin FUC",
      role: Role.ADMIN,
      clubId: club.id
    }
  });

  // Juez demo
  await prisma.user.upsert({
    where: { email: "juez@fuc.test" },
    update: {},
    create: {
      email: "juez@fuc.test",
      name: "Juez Demo",
      role: Role.JUEZ
    }
  });
}

main()
  .then(() => console.log("? Seed OK"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
