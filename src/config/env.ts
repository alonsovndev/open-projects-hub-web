import { z } from "zod";

/**
 * Environment variable schema validation
 * Ensures all required environment variables are present at runtime
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url("VITE_API_BASE_URL must be a valid URL"),
});

/**
 * Validate and parse environment variables
 * Throws error if required variables are missing or invalid
 */
function validateEnv() {
  try {
    return envSchema.parse({
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => `  - ${err.path.join(".")}: ${err.message}`);

      console.error("❌ Environment variable validation failed:\n" + missingVars.join("\n"));
      console.error("\n💡 Check your .env file and ensure all required variables are set.");
    }
    throw new Error("Invalid environment configuration");
  }
}

/**
 * Validated and typed environment variables
 * Use this instead of accessing import.meta.env directly
 */
export const env = validateEnv();

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Development mode flag
 * Use this instead of accessing import.meta.env.DEV directly
 */
export const isDev = import.meta.env.DEV;

/**
 * Production mode flag
 * Use this instead of accessing import.meta.env.PROD directly
 */
export const isProd = import.meta.env.PROD;

/**
 * Current environment mode
 */
export const mode = import.meta.env.MODE;
