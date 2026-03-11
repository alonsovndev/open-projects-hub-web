import React from "react";
import { Typography } from "antd";
import styles from "./AppHeader.module.scss";

interface AppHeaderProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ children, actions }) => {
  return (
    <header className={styles.header}>
      <div className={styles.brandSection}>
        <img src="/logo.svg" alt="Open Freelancer Project Hub logo" className={styles.brandLogo} />

        <Typography.Text className={styles.brandName}>
          Open Freelancer Project Hub
        </Typography.Text>

        {children}
      </div>

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
};
