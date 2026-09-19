import type { FC, ReactNode } from "react";
import { Button, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { AppHeader } from "@/shared/components/layout/app-header";
import { useAppSelector } from "@/app/store/hooks";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { SessionExpiryWarning } from "@/features/auth/components/session-expiry-warning";

import styles from "./private-layout.module.scss";

interface PrivateLayoutProps {
  children: ReactNode;
}

const { Text } = Typography;

export const PrivateLayout: FC<PrivateLayoutProps> = ({ children }) => {
  const session = useAppSelector((state) => state.auth.session);
  const { logout } = useLogout();

  return (
    <div className={styles.container}>
      <SessionExpiryWarning />
      <AppHeader
        identity={
          session ? (
            <Text className={styles.userInfo}>
              <strong>{session.displayName}</strong>
            </Text>
          ) : null
        }
        actions={
          <Button type="link" icon={<LogoutOutlined />} onClick={logout}>
            Sign Out
          </Button>
        }
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
