export const adminAuthConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
  loginEndpoint: "/api/admin/login",
  sessionStorageKey: "open-projects-hub.admin-session",
} as const;
