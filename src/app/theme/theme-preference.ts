export type ThemeMode = "light" | "dark";

const storageKey = "oph-theme";
let preference: ThemeMode | null | undefined;
let deviceTheme: MediaQueryList;
const listeners = new Set<() => void>();

const applyTheme = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
};

export const initializeThemePreference = () => {
  preference = null;
  try {
    const storedMode = window.localStorage.getItem(storageKey);
    if (storedMode === "light" || storedMode === "dark") preference = storedMode;
  } catch {
    // Browsers can block storage while still allowing an in-memory preference.
  }
  deviceTheme = window.matchMedia("(prefers-color-scheme: dark)");
  applyTheme(getThemeMode());
};

export const getThemeMode = (): ThemeMode => {
  if (preference === undefined) initializeThemePreference();
  return preference ?? (deviceTheme.matches ? "dark" : "light");
};

export const subscribeToTheme = (listener: () => void) => {
  getThemeMode();
  listeners.add(listener);
  const updateDeviceTheme = () => {
    if (preference !== null) return;
    applyTheme(getThemeMode());
    listener();
  };
  deviceTheme.addEventListener("change", updateDeviceTheme);
  return () => {
    listeners.delete(listener);
    deviceTheme.removeEventListener("change", updateDeviceTheme);
  };
};

export const toggleTheme = () => {
  preference = getThemeMode() === "light" ? "dark" : "light";
  try {
    window.localStorage.setItem(storageKey, preference);
  } catch {
    // Keep manual switching available when storage is blocked.
  }
  applyTheme(preference);
  listeners.forEach((listener) => listener());
};
