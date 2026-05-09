import { env } from "@/config/env";

export const adminAuthConfig = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  loginEndpoint: "/auth/login",
  registerEndpoint: "/auth/register",
  forgotPasswordEndpoint: "/auth/forgot-password",
  resetPasswordEndpoint: "/auth/reset-password",
  sessionStorageKey: "open-projects-hub.admin-session",
} as const;
