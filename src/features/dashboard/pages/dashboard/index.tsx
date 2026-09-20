import type { FC } from "react";
import { Typography, Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { ProjectList } from "@/features/dashboard/components/project-list";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { useRole } from "@/features/auth/hooks/use-role";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./dashboard.module.scss";

const { Title, Text } = Typography;

export const DashboardPage: FC = () => {
  usePageTitle("Dashboard");

  const {
    user,
    projects,
    stats,
    loading,
    handleViewProject,
    handleCreateProject,
    handleViewAllProjects,
  } = useDashboard();
  const { isAdmin } = useRole();

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text className={styles.loadingText}>Loading dashboard...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <Title level={1} className={styles.pageTitle}>
              Welcome back, {user?.displayName || "there"}
            </Title>
            <Text className={styles.subtitle}>Here's an overview of your projects</Text>
          </div>
          {isAdmin && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateProject}
              className={styles.createButton}
            >
              New Project
            </Button>
          )}
        </div>
      </div>

      {stats && <DashboardStats stats={stats} />}

      <ProjectList
        projects={projects}
        onViewProject={handleViewProject}
        onViewAllProjects={handleViewAllProjects}
      />
    </div>
  );
};

export default DashboardPage;
