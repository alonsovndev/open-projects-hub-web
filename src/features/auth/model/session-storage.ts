import { adminAuthConfig } from "@/resources/config/auth";

export const sessionStorage = {
  clear: (): void => {
    for (const storageName of ["localStorage", "sessionStorage"] as const) {
      try {
        window[storageName].removeItem(adminAuthConfig.sessionStorageKey);
        window[storageName].removeItem("remember_me");
      } catch {
        // One unavailable storage must not prevent clearing the other legacy entry.
      }
    }
  },
};
