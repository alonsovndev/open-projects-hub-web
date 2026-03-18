export const adminAuthConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000",
  loginEndpoint: "/auth/login",
  sessionStorageKey: "open-projects-hub.admin-session",
} as const;
