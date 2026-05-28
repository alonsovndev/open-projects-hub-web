import { useEffect, useState } from "react";

import { useGetUserPreferencesQuery } from "@/features/settings/api/settings-rtk-api";

type ActiveTheme = "light" | "dark";

function resolveSystemTheme(): ActiveTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

export const useActiveTheme = (): ActiveTheme => {
  const { data: preferences, isLoading } = useGetUserPreferencesQuery();
  const [systemTheme, setSystemTheme] = useState<ActiveTheme>(resolveSystemTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

    const handler = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Wait for preferences to load — default to system theme
  const activeTheme: ActiveTheme = (() => {
    if (isLoading || !preferences) return systemTheme;

    if (preferences.theme === "auto") return systemTheme;
    if (preferences.theme === "dark") return "dark";
    return "light";
  })();

  // Sync data-theme attribute on <html> for SCSS-level dark overrides
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  return activeTheme;
};
