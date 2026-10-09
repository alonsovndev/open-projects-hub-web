import type { FC, ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { ConfigProvider } from "antd";

import { darkTokens, lightTokens } from "@/app/theme/theme-tokens";
import { ThemeContext } from "./theme-context";
import {
  getThemeMode,
  initializeThemePreference,
  subscribeToTheme,
  toggleTheme,
} from "./theme-preference";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const mode = useSyncExternalStore(subscribeToTheme, getThemeMode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ConfigProvider theme={mode === "dark" ? darkTokens : lightTokens}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const initializeTheme = () => {
  initializeThemePreference();
  // Static messages and confirmation dialogs have their own React roots.
  ConfigProvider.config({ holderRender: (children) => <ThemeProvider>{children}</ThemeProvider> });
};
