import { useCallback, useEffect, useState } from "react";

export type ActiveTheme = "light" | "dark";

const THEME_OVERRIDE_KEY = "oph-theme";

function resolveSystemTheme(): ActiveTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

function getLocalOverride(): ActiveTheme | null {
  try {
    const val = localStorage.getItem(THEME_OVERRIDE_KEY);
    if (val === "light" || val === "dark") return val;
  } catch {
    // localStorage unavailable
  }
  return null;
}

export const useActiveTheme = (): {
  theme: ActiveTheme;
  toggleTheme: () => void;
} => {
  const [systemTheme, setSystemTheme] = useState<ActiveTheme>(resolveSystemTheme);
  const [localOverride, setLocalOverride] = useState<ActiveTheme | null>(getLocalOverride);

  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

    const handler = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const activeTheme: ActiveTheme = localOverride ?? systemTheme;

  // Sync data-theme attribute on <html> for SCSS-level dark overrides
  // and update favicon to match the active theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);

    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
      favicon.href = activeTheme === "dark" ? "/favicon-dark.svg" : "/favicon.svg";
    }
  }, [activeTheme]);

  const toggleTheme = useCallback(() => {
    const next = activeTheme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_OVERRIDE_KEY, next);
    setLocalOverride(next);
  }, [activeTheme]);

  return { theme: activeTheme, toggleTheme };
};
