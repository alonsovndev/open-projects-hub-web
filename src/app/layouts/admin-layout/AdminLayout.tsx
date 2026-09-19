import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Layout, Menu, Button, Avatar, Typography } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  ExperimentOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAdminSessionState } from "@/features/auth/state/admin-auth-slice";

import styles from "./admin-layout.module.scss";

const { Sider, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);

  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = () => {
    dispatch(clearAdminSessionState());
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "/projects",
      icon: <ProjectOutlined />,
      label: "Projects",
      onClick: () => navigate("/projects"),
    },
    {
      key: "/clients",
      icon: <TeamOutlined />,
      label: "Clients",
      onClick: () => navigate("/clients"),
    },
    {
      key: "/refinement",
      icon: <ExperimentOutlined />,
      label: "AI Refinement",
      onClick: () => navigate("/refinement"),
    },
    {
      key: "/backlog",
      icon: <UnorderedListOutlined />,
      label: "Backlog",
      onClick: () => navigate("/backlog"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
  ];

  // Determine selected key based on current path
  const selectedKey =
    menuItems.find((item) => location.pathname.startsWith(item.key))?.key || "/dashboard";

  return (
    <Layout className={styles.layout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        collapsedWidth={80}
        className={styles.sider}
        trigger={null}
      >
        <div className={styles.siderContent}>
          <div className={styles.logo}>
            <img src="/favicon.svg" alt="Open Projects Hub" className={styles.logoImage} />
            {!collapsed && <span className={styles.brandName}>Open Projects Hub</span>}
          </div>

          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.collapseButton}
          />

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            className={styles.menu}
          />

          <div className={styles.userSection}>
            <div className={styles.userSectionLeft}>
              <Avatar size={collapsed ? 32 : 40} className={styles.avatar}>
                {session?.displayName?.[0]?.toUpperCase() || "A"}
              </Avatar>
              {!collapsed && <Text className={styles.userName}>{session?.displayName}</Text>}
            </div>
            <div className={styles.userSectionRight}>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleSignOut}
                className={styles.logoutButton}
                title="Sign Out"
              />
            </div>
          </div>
        </div>
      </Sider>

      <Layout className={styles.mainLayout}>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};
