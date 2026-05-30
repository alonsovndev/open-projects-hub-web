import type { FC, ReactNode } from "react";
import { ConfigProvider } from "antd";

import { lightTokens, darkTokens } from "@/app/theme/theme-tokens";
import { useActiveTheme } from "@/app/hooks/use-active-theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useActiveTheme();
  const themeConfig = theme === "dark" ? darkTokens : lightTokens;

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};
