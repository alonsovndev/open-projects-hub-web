import { adminAuthConfig } from "@/resources/config/auth";
import type { AdminSession } from "@/features/auth/types";

export const sessionStorage = {
  save: (session: AdminSession): void => {
    try {
      localStorage.setItem(adminAuthConfig.sessionStorageKey, JSON.stringify(session));
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  },

  load: (): AdminSession | null => {
    try {
      const stored = localStorage.getItem(adminAuthConfig.sessionStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to load session:", error);
      return null;
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem(adminAuthConfig.sessionStorageKey);
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  },

  getToken: (): string | null => {
    const session = sessionStorage.load();
    return session?.token ?? null;
  },
};
