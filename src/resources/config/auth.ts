import { env } from "@/config/env";

export const adminAuthConfig = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  loginEndpoint: "/v1/auth/login",
  registerEndpoint: "/v1/auth/register",
  refreshEndpoint: "/v1/auth/refresh",
  forgotPasswordEndpoint: "/v1/auth/forgot-password",
  resetPasswordEndpoint: "/v1/auth/reset-password",
  sessionStorageKey: "open-projects-hub.admin-session",
} as const;
