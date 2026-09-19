import type { FC, ReactNode } from "react";
import { Button, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { AppHeader } from "@/shared/components/layout/app-header";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAdminSessionState } from "@/features/auth/state/admin-auth-slice";

import styles from "./private-layout.module.scss";

interface PrivateLayoutProps {
  children: ReactNode;
}

const { Text } = Typography;

export const PrivateLayout: FC<PrivateLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);

  const handleSignOut = () => {
    dispatch(clearAdminSessionState());
  };

  return (
    <div className={styles.container}>
      <AppHeader
        identity={
          session ? (
            <Text className={styles.userInfo}>
              <strong>{session.displayName}</strong>
            </Text>
          ) : null
        }
        actions={
          <Button type="link" icon={<LogoutOutlined />} onClick={handleSignOut}>
            Sign Out
          </Button>
        }
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
