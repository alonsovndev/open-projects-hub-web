import type { FC } from "react";
import { Card, Tag, Progress, Button, Typography } from "antd";
import { EyeOutlined, CalendarOutlined, TeamOutlined, FileTextOutlined } from "@ant-design/icons";

import type { ProjectSummary, ProjectStatus, ProjectPriority } from "@/features/dashboard/types";

import styles from "./project-list.module.scss";

interface ProjectListProps {
  projects: ProjectSummary[];
  onViewProject: (projectCode: string) => void;
}

const { Text, Title, Paragraph } = Typography;

const statusColors: Record<ProjectStatus, string> = {
  active: "processing",
  completed: "success",
  "on-hold": "warning",
  planning: "default",
};

const priorityColors: Record<ProjectPriority, string> = {
  high: "red",
  medium: "orange",
  low: "blue",
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
};

export const ProjectListComponent: FC<ProjectListProps> = ({ projects, onViewProject }) => {
  return (
    <div className={styles.projectList}>
      <div className={styles.listHeader}>
        <Title level={2} className={styles.listTitle}>
          Projects
        </Title>
        <Text className={styles.listCount}>{projects.length} total</Text>
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
                    <Tag color={statusColors[project.status]} className={styles.statusTag}>
                      {project.status}
                    </Tag>
                    <Tag color={priorityColors[project.priority]} className={styles.priorityTag}>
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
                    strokeColor={{
                      "0%": "#0057c2",
                      "100%": "#006ef2",
                    }}
                    trailColor="#eeeeee"
                  />
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoItem}>
                    <TeamOutlined className={styles.infoIcon} />
                    <Text className={styles.infoText}>{project.teamMembers} members</Text>
                  </div>
                  <div className={styles.infoItem}>
                    <CalendarOutlined className={styles.infoIcon} />
                    <Text className={styles.infoText}>Due {formatDate(project.dueDate)}</Text>
                  </div>
                </div>

                <div className={styles.metaRow}>
                  <Text className={styles.client}>Client: {project.client}</Text>
                  <Text className={styles.lastUpdated}>
                    Updated {getTimeAgo(project.lastUpdated)}
                  </Text>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => onViewProject(project.code)}
                  className={styles.viewButton}
                >
                  View Project
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
