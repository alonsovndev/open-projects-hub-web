import { adminAuthConfig } from "@/resources/config/auth";
import type { AdminSession } from "@/features/auth/types";
import { isDev } from "@/config/env";

export const sessionStorage = {
  save: (session: AdminSession): void => {
    try {
      // Exclude token from localStorage for security
      const { token: _token, ...sessionWithoutToken } = session;
      localStorage.setItem(adminAuthConfig.sessionStorageKey, JSON.stringify(sessionWithoutToken));
    } catch (error) {
      if (isDev) {
        console.error("Failed to save session:", error);
      }
    }
  },

  load: (): Omit<AdminSession, "token"> | null => {
    try {
      const stored = localStorage.getItem(adminAuthConfig.sessionStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      if (isDev) {
        console.error("Failed to load session:", error);
      }
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(adminAuthConfig.sessionStorageKey);
    } catch (error) {
      if (isDev) {
        console.error("Failed to clear session:", error);
      }
    }
  },
};
