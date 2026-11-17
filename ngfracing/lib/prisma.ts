import { PrismaClient } from "@prisma/client";
import { assertDatabaseEnvironment } from "@/lib/environment-safety";

assertDatabaseEnvironment(process.env.POSTGRES_PRISMA_URL);

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
