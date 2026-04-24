import { adminAuthConfig } from "@/resources/config/auth";

import type { AdminSession } from "@/features/auth/types";

export const getAdminSession = (): AdminSession | null => {
  const storedSession = window.localStorage.getItem(adminAuthConfig.sessionStorageKey);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AdminSession;
  } catch {
    window.localStorage.removeItem(adminAuthConfig.sessionStorageKey);
    return null;
  }
};

export const saveAdminSession = (session: AdminSession) => {
  window.localStorage.setItem(adminAuthConfig.sessionStorageKey, JSON.stringify(session));
};

export const clearAdminSession = () => {
  window.localStorage.removeItem(adminAuthConfig.sessionStorageKey);
};
