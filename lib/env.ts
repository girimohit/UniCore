import { z } from "zod";

const envSchema = z.object({
  // SMTP / Email Configuration
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.email("SMTP_USER must be a valid email"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  // FROM_EMAIL: z.email("FROM_EMAIL must be a valid email"),
  // FROM_EMAIL: z.string().email().optional().default("noreply@unicore.com"),
  FROM_EMAIL: z.string().min(1, "FROM_EMAIL is required"),

  // Google OAuth / GMail Configuration
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_REFRESH_TOKEN: z.string().optional(),
  GMAIL_USER: z.email("GMAIL_USER must be a valid email"),

  // Database Configuration
  DATABASE_URL: z.url("DATABASE_URL must be a valid connection string"),
  // DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),

  // Application Configuration
  NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required").default("fallback-super-secret-key-for-dev-only-2024"),

  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

/**
 * Validated environment variables.
 * Throws a descriptive error if any required variable is missing or malformed.
 */
export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
