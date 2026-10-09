import type { FC } from "react";
import { memo } from "react";
import { Card, Tag, Progress, Button, Typography, Pagination, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  KeyOutlined,
  UnorderedListOutlined,
  InboxOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import { PROJECT_STATUS_COLORS, PROJECT_PRIORITY_COLORS } from "@/shared/types/domain";
import type { ProjectSummary } from "@/features/dashboard/types";
import { formatDate, formatRelativeTime } from "@/shared/utils/date";

import styles from "./project-list.module.scss";

interface ProjectListProps {
  projects: ProjectSummary[];
  currentPage?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number, pageSize?: number) => void;
  onViewProject: (accessCode: string) => void;
  onEditProject?: (projectId: string) => void;
  onDeleteProject?: (projectId: string, projectName: string) => void;
  onArchiveProject?: (projectId: string, projectName: string) => void;
  onReactivateProject?: (projectId: string, projectName: string) => void;
  onViewAllProjects?: () => void;
  /** Whether the caller may change projects. Defaults to false so a caller that forgets it fails closed. */
  canManage?: boolean;
}

const { Text, Title, Paragraph } = Typography;

const ProjectListComponent: FC<ProjectListProps> = ({
  projects,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
  onViewProject,
  onEditProject,
  onDeleteProject,
  onArchiveProject,
  onReactivateProject,
  onViewAllProjects,
  canManage = false,
}) => {
  return (
    <div className={styles.projectList}>
      <div className={styles.listHeader}>
        <Title level={2} className={styles.listTitle}>
          Projects
        </Title>
        <div className={styles.headerActions}>
          <Text className={styles.listCount}>
            {totalCount !== undefined ? `${totalCount} total` : `${projects.length} total`}
          </Text>
          {onViewAllProjects && (
            <Button
              type="default"
              icon={<UnorderedListOutlined />}
              onClick={onViewAllProjects}
              className={styles.viewAllButton}
            >
              View All Projects
            </Button>
          )}
        </div>
      </div>

      <div className={styles.projectGrid}>
        {projects.map((project) => {
          const completionPercent =
            project.storiesCount > 0
              ? Math.round((project.completedStories / project.storiesCount) * 100)
              : 0;

          return (
            <Card key={project.id} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerTop}>
                  <div className={styles.projectMeta}>
                    <Title level={4} className={styles.projectName}>
                      {project.name}
                    </Title>
                    <Text className={styles.projectCode}>{project.code}</Text>
                  </div>
                  <div className={styles.tags}>
                    <Tag color={PROJECT_STATUS_COLORS[project.status]} className={styles.statusTag}>
                      {project.status}
                    </Tag>
                    <Tag
                      color={PROJECT_PRIORITY_COLORS[project.priority]}
                      className={styles.priorityTag}
                    >
                      {project.priority}
                    </Tag>
                  </div>
                </div>

                <Paragraph className={styles.description} ellipsis={{ rows: 2 }}>
                  {project.description}
                </Paragraph>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <Text className={styles.progressLabel}>Story Completion</Text>
                    <Text className={styles.progressValue}>
                      {project.completedStories}/{project.storiesCount}
                    </Text>
                  </div>
                  <Progress
                    percent={completionPercent}
                    strokeColor="var(--color-primary)"
                    trailColor="#eeeeee"
                  />
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <CalendarOutlined className={styles.infoIcon} />
                    <Text className={styles.infoText}>
                      {project.startDate ? formatDate(project.startDate) : "No start date"} -{" "}
                      {project.endDate ? formatDate(project.endDate) : "No end date"}
                    </Text>
                  </div>
                  <div className={styles.infoItem}>
                    <KeyOutlined className={styles.infoIcon} />
                    <Text className={styles.infoText}>
                      Access code:{" "}
                      <Text code copyable={{ text: project.accessCode }}>
                        {project.accessCode}
                      </Text>
                    </Text>
                  </div>
                </div>

                <div className={styles.metaRow}>
                  <Text className={styles.client}>Client: {project.client}</Text>
                  <Text
                    className={styles.lastUpdated}
                    title={`Created ${formatDate(project.createdAt)} · Updated ${formatDate(project.lastUpdated)}`}
                  >
                    Created {formatDate(project.createdAt)} · Updated{" "}
                    {formatRelativeTime(project.lastUpdated)}
                  </Text>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Space size="small" wrap className={styles.actions}>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => onViewProject(project.accessCode)}
                    className={styles.viewButton}
                  >
                    View
                  </Button>
                  {canManage && onEditProject && (
                    <Button
                      type="default"
                      icon={<EditOutlined />}
                      onClick={() => onEditProject(project.id)}
                      className={styles.editButton}
                    >
                      Edit
                    </Button>
                  )}
                  {canManage && onArchiveProject && project.status !== "archived" && (
                    <Button
                      type="default"
                      icon={<InboxOutlined />}
                      onClick={() => onArchiveProject(project.id, project.name)}
                      aria-label={`Archive ${project.name}`}
                    >
                      Archive
                    </Button>
                  )}
                  {canManage && onReactivateProject && project.status === "archived" && (
                    <Button
                      type="default"
                      icon={<UndoOutlined />}
                      onClick={() => onReactivateProject(project.id, project.name)}
                      aria-label={`Reactivate ${project.name}`}
                    >
                      Reactivate
                    </Button>
                  )}
                  {canManage && onDeleteProject && (
                    <Button
                      type="default"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onDeleteProject(project.id, project.name)}
                      className={styles.deleteButton}
                      aria-label={`Delete ${project.name}`}
                    >
                      Delete
                    </Button>
                  )}
                </Space>
              </div>
            </Card>
          );
        })}
      </div>

      {onPageChange &&
        currentPage &&
        pageSize &&
        totalCount !== undefined &&
        totalCount > pageSize && (
          <div className={styles.paginationWrapper}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCount}
              showSizeChanger
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} projects`}
              pageSizeOptions={["10", "20", "50", "100"]}
              onChange={onPageChange}
            />
          </div>
        )}
    </div>
  );
};

export const ProjectList = memo(ProjectListComponent);
