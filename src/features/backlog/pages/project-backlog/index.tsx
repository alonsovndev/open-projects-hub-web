import type { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Select, Space, Button, Spin, Alert } from "antd";
import { ArrowLeftOutlined, FileMarkdownOutlined } from "@ant-design/icons";

import { StoryList } from "@/features/backlog/components/story-list";
import { useProjectBacklog } from "@/features/backlog/hooks/use-project-backlog";
import { useBacklogExport } from "@/features/backlog/hooks/use-backlog-export";
import { useRole } from "@/features/auth/hooks/use-role";
import { useGetProjectsQuery } from "@/features/projects/api/projects-api";
import { usePageTitle } from "@/shared/hooks/use-page-title";
import type { ProjectSummary } from "@/shared/types/domain";

import styles from "./project-backlog.module.scss";

const { Title, Text } = Typography;

export const ProjectBacklogPage: FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  usePageTitle("Project Stories");

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery({
    limit: 100,
  });

  const {
    stories,
    totalStories,
    isLoading: isLoadingStories,
    error,
  } = useProjectBacklog(projectId ?? "");

  const { exportBacklog, isExporting } = useBacklogExport();

  const projectOptions =
    projectsData?.projects.map((p: ProjectSummary) => ({
      label: `${p.name} (${p.code})`,
      value: p.id,
    })) ?? [];

  const selectedProject = projectsData?.projects.find((p: ProjectSummary) => p.id === projectId);

  const { canEdit } = useRole();

  const handleProjectChange = (newProjectId: string) => {
    navigate(`/backlog/project/${newProjectId}`);
  };

  const handleBack = () => {
    navigate("/backlog");
  };

  const handleExportMarkdown = () => exportBacklog(projectId ?? null);

  const handleDeleteStory = async (_storyId: string) => {
    // TODO: Implement delete functionality when backend endpoint is available
  };

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Alert
          message="Error Loading Stories"
          description="Failed to load stories for this project. Please try again."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className={styles.backButton}
            >
              Back to Backlog
            </Button>
            <div>
              <Title level={1} className={styles.pageTitle}>
                {selectedProject ? selectedProject.name : "Project Stories"}
              </Title>
              <Text className={styles.pageSubtitle}>
                {selectedProject && `${selectedProject.code} • `}
                {totalStories} {totalStories === 1 ? "story" : "stories"}
              </Text>
            </div>
          </div>
          <Space wrap className={styles.headerActions}>
            <div className={styles.projectSelector}>
              <Text strong id="backlog-project-label">
                Project:
              </Text>
              <Select
                className={styles.projectSelect}
                aria-labelledby="backlog-project-label"
                placeholder="Select a project"
                options={projectOptions}
                value={projectId || undefined}
                onChange={handleProjectChange}
                loading={isLoadingProjects}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </div>
            {canEdit && (
              <Button
                type="default"
                size="large"
                icon={<FileMarkdownOutlined />}
                aria-label="Export backlog"
                onClick={handleExportMarkdown}
                disabled={!projectId}
                loading={isExporting}
                className={styles.actionButton}
              >
                Export
              </Button>
            )}
          </Space>
        </div>
      </div>

      {isLoadingStories ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Loading stories..." />
        </div>
      ) : (
        <StoryList stories={stories} onDelete={handleDeleteStory} canManage={canEdit} />
      )}
    </div>
  );
};

export default ProjectBacklogPage;
