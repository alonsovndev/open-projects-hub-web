import type { FC } from "react";
import { Typography, Button, Spin, Alert } from "antd";
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
    hasError,
    handleViewProject,
    handleCreateProject,
    handleViewAllProjects,
  } = useDashboard();
  const { canEdit } = useRole();

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
          {canEdit && (
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

      {hasError && (
        <Alert
          type="error"
          showIcon
          message="Couldn't load your dashboard"
          description="Some data failed to load. Refresh the page to try again."
        />
      )}

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
