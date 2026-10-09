import { Button, Tooltip } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

import { useTheme } from "@/app/theme/theme-context";

import styles from "./theme-toggle.module.scss";

export const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const label = mode === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <Tooltip title={label}>
      <Button
        type="text"
        className={styles.toggle}
        aria-label={label}
        onClick={toggleTheme}
        icon={
          mode === "light" ? (
            <MoonOutlined aria-hidden="true" />
          ) : (
            <SunOutlined aria-hidden="true" />
          )
        }
      />
    </Tooltip>
  );
};
