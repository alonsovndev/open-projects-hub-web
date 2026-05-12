import type { FC } from "react";
import { memo } from "react";
import { List, Card, Tag, Typography, Button, Space, Popconfirm, Empty } from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import type { Story } from "@/features/backlog/types";
import type { ProjectPriority } from "@/features/dashboard/types";

import styles from "./story-list.module.scss";

const { Text, Paragraph } = Typography;

interface StoryListProps {
  stories: Story[];
  onDelete: (storyId: string) => void;
}

const priorityColors: Record<ProjectPriority, string> = {
  high: "red",
  medium: "orange",
  low: "blue",
};

const statusColors: Record<string, string> = {
  backlog: "default",
  ready: "processing",
  "in-progress": "warning",
  review: "purple",
  done: "success",
};

const StoryListComponent: FC<StoryListProps> = ({ stories, onDelete }) => {
  return (
    <List
      className={styles.storyList}
      dataSource={stories}
      locale={{
        emptyText: (
          <Empty
            image={<FileTextOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
            description="No stories found"
          />
        ),
      }}
      renderItem={(story) => (
        <List.Item className={styles.listItem}>
          <Card className={styles.storyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerLeft}>
                <Text className={styles.storyTitle}>{story.title}</Text>
                <Space size="small" className={styles.tags}>
                  <Tag color={statusColors[story.status]}>{story.status}</Tag>
                  <Tag color={priorityColors[story.priority]}>{story.priority}</Tag>
                  {story.storyPoints && (
                    <Tag className={styles.pointsTag}>{story.storyPoints} pts</Tag>
                  )}
                </Space>
              </div>
              <Popconfirm
                title="Delete story"
                description="Are you sure you want to delete this story?"
                onConfirm={() => onDelete(story.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  className={styles.deleteButton}
                />
              </Popconfirm>
            </div>

            <Paragraph className={styles.description}>{story.description}</Paragraph>

            {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
              <div className={styles.criteriaSection}>
                <Text className={styles.criteriaTitle}>Acceptance Criteria:</Text>
                <ul className={styles.criteriaList}>
                  {story.acceptanceCriteria.map((criteria, index) => (
                    <li key={index} className={styles.criteriaItem}>
                      <CheckCircleOutlined className={styles.criteriaIcon} />
                      <Text className={styles.criteriaText}>{criteria}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.cardFooter}>
              <Space size="middle">
                <Space size="small">
                  <ProjectOutlined className={styles.metaIcon} />
                  <Text className={styles.metaText}>{story.projectName}</Text>
                </Space>
                {story.assignee && (
                  <Space size="small">
                    <UserOutlined className={styles.metaIcon} />
                    <Text className={styles.metaText}>{story.assignee}</Text>
                  </Space>
                )}
              </Space>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export const StoryList = memo(StoryListComponent);
