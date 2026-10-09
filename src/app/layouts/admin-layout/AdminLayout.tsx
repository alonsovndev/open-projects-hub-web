import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Layout, Menu, Button, Avatar, Typography, Drawer, Grid } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  ExperimentOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useRole } from "@/features/auth/hooks/use-role";
import { SessionExpiryWarning } from "@/features/auth/components/session-expiry-warning";
import { ThemeToggle } from "@/shared/components/theme-toggle/ThemeToggle";

import styles from "./admin-layout.module.scss";

const { Sider, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useAppSelector((state) => state.auth.session);
  const { logout } = useLogout();
  const { canEdit } = useRole();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const isMobile = screens.lg === false;
  const navigationCollapsed = !isMobile && collapsed;

  // Editor-only destinations are left out of the menu entirely rather than disabled, so a
  // role that cannot open them is never invited to a trip to /unauthorized.
  const allMenuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined aria-hidden="true" />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "/projects",
      icon: <ProjectOutlined aria-hidden="true" />,
      label: "Projects",
      onClick: () => navigate("/projects"),
    },
    {
      key: "/clients",
      icon: <TeamOutlined aria-hidden="true" />,
      label: "Clients",
      onClick: () => navigate("/clients"),
      editorOnly: true,
    },
    {
      key: "/refinement",
      icon: <ExperimentOutlined aria-hidden="true" />,
      label: "AI Refinement",
      onClick: () => navigate("/refinement"),
      editorOnly: true,
    },
    {
      key: "/backlog",
      icon: <UnorderedListOutlined aria-hidden="true" />,
      label: "Backlog",
      onClick: () => navigate("/backlog"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined aria-hidden="true" />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
  ];

  const menuItems = allMenuItems
    .filter((item) => canEdit || !item.editorOnly)
    .map(({ editorOnly: _editorOnly, ...item }) => item);

  // Determine selected key based on current path
  const selectedKey =
    menuItems.find((item) => location.pathname.startsWith(item.key))?.key || "/dashboard";

  const navigationPanel = (
    <div className={styles.siderContent}>
      <div className={styles.logo}>
        <img src="/favicon.svg" alt="Open Projects Hub" className={styles.logoImage} />
        {!navigationCollapsed && <span className={styles.brandName}>Open Projects Hub</span>}
      </div>

      {!isMobile && (
        <Button
          type="text"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!collapsed}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!navigationCollapsed)}
          className={styles.collapseButton}
        />
      )}

      <Menu
        mode="inline"
        inlineCollapsed={navigationCollapsed}
        onClick={() => setMobileMenuOpen(false)}
        selectedKeys={[selectedKey]}
        items={menuItems}
        className={styles.menu}
      />

      <div className={styles.userSection}>
        <div className={styles.userSectionLeft}>
          <Avatar size={navigationCollapsed ? 32 : 40} className={styles.avatar}>
            {session?.displayName?.[0]?.toUpperCase() || "A"}
          </Avatar>
          {!navigationCollapsed && (
            <div className={styles.userText}>
              <Text className={styles.userName}>{session?.displayName}</Text>
              {session?.workspace && (
                <Text type="secondary" className={styles.workspaceName} ellipsis>
                  {session.workspace.name}
                </Text>
              )}
            </div>
          )}
        </div>
        <div className={styles.userSectionRight}>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
            className={styles.logoutButton}
            title="Sign Out"
            aria-label="Sign Out"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Layout className={styles.layout}>
      <SessionExpiryWarning />
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={240}
          collapsedWidth={80}
          className={styles.sider}
          trigger={null}
        >
          {navigationPanel}
        </Sider>
      )}

      <Drawer
        title="Navigation"
        placement="left"
        open={isMobile && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className={styles.navigationDrawer}
      >
        {isMobile && <div id="workspace-navigation">{navigationPanel}</div>}
      </Drawer>

      <Layout className={styles.mainLayout}>
        <header className={styles.workspaceHeader}>
          {isMobile && (
            <>
              <img src="/favicon.svg" alt="" className={styles.logoImage} />
              <span className={styles.brandName}>Open Projects Hub</span>
              <Button
                type="text"
                icon={<MenuOutlined />}
                aria-label="Open navigation"
                aria-expanded={mobileMenuOpen}
                aria-controls="workspace-navigation"
                onClick={() => setMobileMenuOpen(true)}
                className={styles.mobileMenuButton}
              />
            </>
          )}
          <ThemeToggle />
        </header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};
