import type { FC } from "react";
import { Typography, Button, Space } from "antd";
import { PlusOutlined, FileMarkdownOutlined } from "@ant-design/icons";

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
    handleDeleteStory,
    handleSearchChange,
    handleProjectFilter,
    handlePriorityFilter,
    handleAssigneeFilter,
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
              AI-generated user stories ({filteredStories.length} items)
            </Text>
          </div>
          <Space>
            <Button
              type="default"
              size="large"
              icon={<FileMarkdownOutlined />}
              onClick={handleExportMarkdown}
              className={styles.actionButton}
            >
              Export Markdown
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className={styles.createButton}
            >
              New Story
            </Button>
          </Space>
        </div>
      </div>

      <BacklogFiltersBar
        filters={filters}
        activeFilterCount={activeFilterCount}
        onSearchChange={handleSearchChange}
        onProjectFilter={handleProjectFilter}
        onPriorityFilter={handlePriorityFilter}
        onAssigneeFilter={handleAssigneeFilter}
        onClearFilters={handleClearFilters}
      />

      <StoryList stories={filteredStories} onDelete={handleDeleteStory} />
    </div>
  );
};
export default BacklogPage;
