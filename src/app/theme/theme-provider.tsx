import type { FC, ReactNode } from "react";
import { ConfigProvider } from "antd";

import { lightTokens } from "@/app/theme/theme-tokens";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return <ConfigProvider theme={lightTokens}>{children}</ConfigProvider>;
};