import { z } from "zod";

const isProd = process.env.NODE_ENV === "production";

// Fields that are required in production but optional in dev
const prodRequired = (field: z.ZodString) =>
  isProd ? field.min(1) : field.optional().default("");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().regex(/^\d+$/).optional().default("3000"),

  // Auth
  JWT_SECRET: prodRequired(z.string().min(32, "JWT_SECRET must be at least 32 characters")),
  ADMIN_PASSWORD: prodRequired(z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters")),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Supabase
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  SUPABASE_STORAGE_BUCKET: z.string().optional().default("uploads"),

  // CORS
  CORS_ORIGIN: z.string().optional(),
});

export function validateEnv(): void {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error("❌ Environment variable validation error:");
    for (const [key, msgs] of Object.entries(errors)) {
      console.error(`   ${key}: ${msgs?.join(", ")}`);
    }
    if (isProd) {
      console.error("Cannot start in production with missing environment variables.");
      process.exit(1);
    } else {
      console.warn("⚠️  Continuing in dev mode with missing variables.");
    }
  }
}
