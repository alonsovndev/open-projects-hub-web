import { adminAuthConfig } from "@/resources/config/admin-auth";

import type { AdminAuthResponse, AdminLoginValues, AdminSession } from "@/features/admin-auth/types";

const createDemoSession = (email: string): AdminSession => {
  const normalizedEmail = email.trim().toLowerCase();
  const nameFromEmail = normalizedEmail.split("@")[0] ?? "admin";

  return {
    token: "demo-admin-session-token",
    email: normalizedEmail,
    displayName: nameFromEmail.replace(/[._-]+/g, " "),
    loggedInAt: new Date().toISOString(),
  };
};

export const authenticateAdmin = async (credentials: AdminLoginValues): Promise<AdminAuthResponse> => {
  void adminAuthConfig.loginEndpoint;

  await new Promise((resolve) => {
    window.setTimeout(resolve, 500);
  });

  return {
    session: createDemoSession(credentials.email),
  };
};
