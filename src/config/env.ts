import { z } from "zod";

// CSP forbids eval; use Zod's interpreter instead of runtime code generation.
z.config({ jitless: true });

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
function resolveApiOrigin(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (import.meta.env.PROD) return configured || window.location.origin;
  const apiOrigin = new URL(configured || "http://localhost:8000");
  if (
    ["localhost", "127.0.0.1"].includes(apiOrigin.hostname) &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    return window.location.origin;
  }
  return apiOrigin.origin;
}

function validateEnv() {
  try {
    return envSchema.parse({
      VITE_API_BASE_URL: resolveApiOrigin(),
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
