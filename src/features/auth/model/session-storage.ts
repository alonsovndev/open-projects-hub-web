import { adminAuthConfig } from "@/resources/config/auth";
import type { AdminSession } from "@/features/auth/types";
import { isDev } from "@/config/env";

const REMEMBER_ME_KEY = "remember_me";

export const sessionStorage = {
  save: (session: AdminSession, rememberMe = false): void => {
    try {
      // Exclude token from localStorage for security
      const { token: _token, ...sessionWithoutToken } = session;
      const storageType = rememberMe ? window.localStorage : window.sessionStorage;
      storageType.setItem(adminAuthConfig.sessionStorageKey, JSON.stringify(sessionWithoutToken));

      // Store remember me preference
      if (rememberMe) {
        window.localStorage.setItem(REMEMBER_ME_KEY, "true");
      }
    } catch (error) {
      if (isDev) {
        console.error("Failed to save session:", error);
      }
    }
  },

  load: (): Omit<AdminSession, "token"> | null => {
    try {
      const rememberMe = window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
      const storageType = rememberMe ? window.localStorage : window.sessionStorage;
      const stored = storageType.getItem(adminAuthConfig.sessionStorageKey);
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
      window.localStorage.removeItem(adminAuthConfig.sessionStorageKey);
      window.sessionStorage.removeItem(adminAuthConfig.sessionStorageKey);
      window.localStorage.removeItem(REMEMBER_ME_KEY);
    } catch (error) {
      if (isDev) {
        console.error("Failed to clear session:", error);
      }
    }
  },
};
