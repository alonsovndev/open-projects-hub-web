import type { FC, ReactNode } from "react";

import { Typography } from "antd";

import styles from "./app-header.module.scss";

interface AppHeaderProps {
  children?: ReactNode;
  actions?: ReactNode;
  identity?: ReactNode;
}

const { Text } = Typography;

export const AppHeader: FC<AppHeaderProps> = ({ children, actions, identity }) => {
  return (
    <header className={styles.header}>
      <div className={styles.brandSection}>
        <img src="/logo.svg" alt="Open Freelancer Project Hub logo" className={styles.brandLogo} />

        <Text className={styles.brandName}>Open Freelancer Project Hub</Text>

        {children}
      </div>

      {actions || identity ? (
        <div className={styles.actions}>
          {identity}
          {actions}
        </div>
      ) : null}
    </header>
  );
};
