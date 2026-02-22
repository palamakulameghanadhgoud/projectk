import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Fallback for prisma generate when DATABASE_URL is not set (e.g. CI, first clone)
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/daa?schema=public",
  },
});
