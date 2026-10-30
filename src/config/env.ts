import { config } from "dotenv";
import { z } from "zod";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  SERVER_URL: z.url("SERVER_URL must be a valid URL"),
  APP_URL: z.url("APP_URL must be a valid URL"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  EXPIRES_IN: z.string().default("30m"),

  // Arcjet
  ARCJET_KEY: z.string().min(1, "ARCJET_KEY is required"),

  // Upstash QStash / Workflow
  QSTASH_URL: z.string().optional(),
  QSTASH_TOKEN: z.string().min(1, "QSTASH_TOKEN is required"),
  QSTASH_CURRENT_SIGNING_KEY: z
    .string()
    .min(1, "QSTASH_CURRENT_SIGNING_KEY is required"),
  QSTASH_NEXT_SIGNING_KEY: z
    .string()
    .min(1, "QSTASH_NEXT_SIGNING_KEY is required"),

  // Resend
  RESEND_KEY: z.string().min(1, "RESEND_KEY is required"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formatted = result.error.issues
    .map((i) => `  · ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  console.error(`\n❌ Invalid environment variables:\n${formatted}\n`);
  process.exit(1);
}

export const env = result.data;
export type Env = typeof env;
