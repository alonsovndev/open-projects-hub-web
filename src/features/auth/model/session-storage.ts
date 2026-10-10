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
    } catch {
      if (isDev) {
        console.error("Failed to save session.");
      }
    }
  },

  load: (): Omit<AdminSession, "token"> | null => {
    const rememberMe = window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
    const storageType = rememberMe ? window.localStorage : window.sessionStorage;

    try {
      const stored = storageType.getItem(adminAuthConfig.sessionStorageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      if (isDev) {
        console.error("Failed to load session, clearing corrupt entry.");
      }
      // Malformed/corrupt entry would otherwise fail to parse on every future
      // load (including the one computing isBootstrapping on every app boot)
      // — remove it so the app self-heals instead of getting stuck.
      try {
        storageType.removeItem(adminAuthConfig.sessionStorageKey);
      } catch {
        // Storage inaccessible entirely (e.g. private mode) — nothing more we can do.
      }
      return null;
    }
  },

  isRemembered: (): boolean => {
    try {
      return window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
    } catch {
      return false;
    }
  },

  clear: (): void => {
    try {
      window.localStorage.removeItem(adminAuthConfig.sessionStorageKey);
      window.sessionStorage.removeItem(adminAuthConfig.sessionStorageKey);
      window.localStorage.removeItem(REMEMBER_ME_KEY);
    } catch {
      if (isDev) {
        console.error("Failed to clear session.");
      }
    }
  },
};
