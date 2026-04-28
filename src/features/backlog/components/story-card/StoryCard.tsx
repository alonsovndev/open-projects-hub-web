import type { FC } from "react";
import { Card, Tag, Typography, Button, Space } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DragOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ProjectOutlined,
} from "@ant-design/icons";

import type { Story } from "@/features/backlog/types";
import type { ProjectPriority } from "@/features/dashboard/types";

import styles from "./story-card.module.scss";

const { Text, Paragraph } = Typography;

interface StoryCardProps {
  story: Story;
  onEdit: (story: Story) => void;
  onDelete: (storyId: string) => void;
}

const priorityColors: Record<ProjectPriority, string> = {
  high: "red",
  medium: "orange",
  low: "blue",
};

export const StoryCardComponent: FC<StoryCardProps> = ({ story, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: story.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.cardWrapper}>
      <Card className={styles.storyCard} size="small">
        <div className={styles.cardHeader}>
          <div className={styles.dragHandle} {...attributes} {...listeners}>
            <DragOutlined />
          </div>
          <Tag color={priorityColors[story.priority]} className={styles.priorityTag}>
            {story.priority}
          </Tag>
        </div>

        <div className={styles.cardContent}>
          <Text className={styles.storyTitle}>{story.title}</Text>

          <Paragraph className={styles.storyDescription} ellipsis={{ rows: 2 }}>
            {story.description}
          </Paragraph>

          <div className={styles.metadata}>
            <Space size="small" className={styles.metaRow}>
              <ProjectOutlined className={styles.metaIcon} />
              <Text className={styles.metaText}>{story.projectName}</Text>
            </Space>

            {story.assignee && (
              <Space size="small" className={styles.metaRow}>
                <UserOutlined className={styles.metaIcon} />
                <Text className={styles.metaText}>{story.assignee}</Text>
              </Space>
            )}

            {story.storyPoints && <Tag className={styles.pointsTag}>{story.storyPoints} pts</Tag>}
          </div>
        </div>

        <div className={styles.cardActions}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(story)}
            className={styles.actionButton}
          >
            Edit
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(story.id)}
            className={styles.actionButton}
          />
        </div>
      </Card>
    </div>
  );
};
