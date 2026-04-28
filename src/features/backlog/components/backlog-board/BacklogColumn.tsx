import type { FC } from "react";
import { Card, Typography, Badge } from "antd";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import type { Story, StoryStatus } from "@/features/backlog/types";
import { StoryCard } from "@/features/backlog/components/story-card";

import styles from "./backlog-board.module.scss";

const { Title } = Typography;

interface BacklogColumnProps {
  id: StoryStatus;
  title: string;
  stories: Story[];
  onEditStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
}

const statusColors: Record<StoryStatus, string> = {
  backlog: "#8c8c8c",
  ready: "#1677ff",
  "in-progress": "#faad14",
  review: "#722ed1",
  done: "#52c41a",
};

export const BacklogColumnComponent: FC<BacklogColumnProps> = ({
  id,
  title,
  stories,
  onEditStory,
  onDeleteStory,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className={styles.columnWrapper}>
      <Card className={`${styles.column} ${isOver ? styles.columnOver : ""}`} ref={setNodeRef}>
        <div className={styles.columnHeader} style={{ borderLeftColor: statusColors[id] }}>
          <Title level={4} className={styles.columnTitle}>
            {title}
          </Title>
          <Badge
            count={stories.length}
            showZero
            style={{ backgroundColor: statusColors[id] }}
            className={styles.countBadge}
          />
        </div>

        <div className={styles.columnContent}>
          <SortableContext items={stories.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onEdit={onEditStory}
                onDelete={onDeleteStory}
              />
            ))}
          </SortableContext>

          {stories.length === 0 && (
            <div className={styles.emptyColumn}>
              <span className={styles.emptyText}>Drop stories here</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
