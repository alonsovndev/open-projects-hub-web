import type { FC } from "react";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

import { useActiveTheme } from "@/app/hooks/use-active-theme";

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useActiveTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="text"
      size="large"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    />
  );
};
