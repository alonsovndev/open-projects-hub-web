import type { FC } from "react";
import { Typography, Button, Space, Spin, Alert } from "antd";
import { FileMarkdownOutlined } from "@ant-design/icons";

import { StoryList } from "@/features/backlog/components/story-list";
import { BacklogFiltersBar } from "@/features/backlog/components/backlog-filters";
import { useBacklog } from "@/features/backlog/hooks/use-backlog";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./backlog.module.scss";

const { Title, Text } = Typography;

export const BacklogPage: FC = () => {
  usePageTitle("Backlog");
  const {
    filteredStories,
    filters,
    activeFilterCount,
    isLoading,
    error,
    isLoadingProjects,
    projectOptions,
    handleDeleteStory,
    handleSearchChange,
    handleProjectFilter,
    handlePriorityFilter,
    handleClearFilters,
    handleExportMarkdown,
  } = useBacklog();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div>
            <Title level={1} className={styles.pageTitle}>
              Backlog
            </Title>
            <Text className={styles.pageSubtitle}>
              Generated user stories ({filteredStories.length} items)
            </Text>
          </div>
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<FileMarkdownOutlined />}
              onClick={handleExportMarkdown}
            >
              Export Markdown
            </Button>
          </Space>
        </div>
      </div>

      {error ? (
        <Alert
          message="Error Loading Backlog"
          description="Failed to load backlog stories. Please try again."
          type="error"
          showIcon
          className={styles.errorAlert}
        />
      ) : (
        <>
          <BacklogFiltersBar
            filters={filters}
            activeFilterCount={activeFilterCount}
            projectOptions={projectOptions}
            isLoadingProjects={isLoadingProjects}
            onSearchChange={handleSearchChange}
            onProjectFilter={handleProjectFilter}
            onPriorityFilter={handlePriorityFilter}
            onClearFilters={handleClearFilters}
          />

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" tip="Loading stories..." />
            </div>
          ) : (
            <StoryList stories={filteredStories} onDelete={handleDeleteStory} />
          )}
        </>
      )}
    </div>
  );
};
export default BacklogPage;
