import { defineConfig, env } from "prisma/config";

try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local absent (e.g. в проде переменные уже заданы платформой)
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Миграции требуют прямого (не pooled) соединения — см. заметку Neon-скилла.
    url: env("DATABASE_URL_UNPOOLED"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
