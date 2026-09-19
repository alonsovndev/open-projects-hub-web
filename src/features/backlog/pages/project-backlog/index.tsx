import type { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Select, Space, Button, Spin, Alert } from "antd";
import { ArrowLeftOutlined, FileMarkdownOutlined } from "@ant-design/icons";

import { StoryList } from "@/features/backlog/components/story-list";
import { useProjectStories } from "@/features/backlog/hooks/use-project-stories";
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
  } = useProjectStories({
    projectId: projectId ?? "",
    limit: 50,
    offset: 0,
  });

  const projectOptions =
    projectsData?.projects.map((p: ProjectSummary) => ({
      label: `${p.name} (${p.code})`,
      value: p.id,
    })) ?? [];

  const selectedProject = projectsData?.projects.find((p: ProjectSummary) => p.id === projectId);

  const handleProjectChange = (newProjectId: string) => {
    navigate(`/backlog/project/${newProjectId}`);
  };

  const handleBack = () => {
    navigate("/backlog");
  };

  const handleExportMarkdown = () => {
    if (stories.length === 0) {
      return;
    }

    let markdown = `# User Stories - ${selectedProject?.name || "Project"}\n\n`;
    markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    markdown += `Total Stories: ${stories.length}\n\n`;
    markdown += "---\n\n";

    stories.forEach((story, index) => {
      markdown += `## ${index + 1}. ${story.title}\n\n`;
      markdown += `**Project:** ${selectedProject?.name ?? "Project"} (${projectId})\n\n`;
      markdown += `**Status:** ${story.status}\n\n`;
      markdown += `**Priority:** ${story.priority}\n\n`;
      if (story.assignee) {
        markdown += `**Assignee:** ${story.assignee}\n\n`;
      }
      if (story.storyPoints) {
        markdown += `**Story Points:** ${story.storyPoints}\n\n`;
      }
      markdown += `### Description\n\n${story.description}\n\n`;

      if (story.acceptanceCriteria && story.acceptanceCriteria.length > 0) {
        markdown += `### Acceptance Criteria\n\n`;
        story.acceptanceCriteria.forEach((criteria, i) => {
          markdown += `${i + 1}. ${criteria}\n`;
        });
        markdown += "\n";
      }

      markdown += "---\n\n";
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stories-${selectedProject?.code || projectId}-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <Space>
            <div className={styles.projectSelector}>
              <Text strong style={{ marginRight: 8 }}>
                Project:
              </Text>
              <Select
                style={{ width: 300 }}
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
            <Button
              type="default"
              size="large"
              icon={<FileMarkdownOutlined />}
              onClick={handleExportMarkdown}
              disabled={stories.length === 0}
              className={styles.actionButton}
            >
              Export
            </Button>
          </Space>
        </div>
      </div>

      {isLoadingStories ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" tip="Loading stories..." />
        </div>
      ) : (
        <StoryList stories={stories} onDelete={handleDeleteStory} />
      )}
    </div>
  );
};

export default ProjectBacklogPage;
