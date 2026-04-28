import type { FC } from "react";
import { Typography, Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { ProjectList } from "@/features/dashboard/components/project-list";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";

import styles from "./dashboard.module.scss";

const { Title, Text } = Typography;

export const DashboardPage: FC = () => {
  const {
    user,
    projects,
    stats,
    loading,
    handleViewProject,
    handleCreateProject,
    handleViewAllProjects,
  } = useDashboard();

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
              Welcome back, {user?.displayName || "Admin"}
            </Title>
            <Text className={styles.subtitle}>
              Here's an overview of your projects and team activity
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
            className={styles.createButton}
          >
            New Project
          </Button>
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
