import type { FC } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { Story, BacklogColumn as BacklogColumnType } from "@/features/backlog/types";
import { BacklogColumnComponent } from "./BacklogColumn";
import { StoryCard } from "@/features/backlog/components/story-card";

import styles from "./backlog-board.module.scss";

interface BacklogBoardProps {
  columns: BacklogColumnType[];
  activeStory: Story | null;
  onDragStart: (storyId: string) => void;
  onDragEnd: (storyId: string, newStatus: string) => void;
  onEditStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => void;
}

export const BacklogBoardComponent: FC<BacklogBoardProps> = ({
  columns,
  activeStory,
  onDragStart,
  onDragEnd,
  onEditStory,
  onDeleteStory,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: any) => {
    onDragStart(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      onDragEnd(active.id, "");
      return;
    }

    // Check if dropped on a different column
    const targetColumn = columns.find((col) => col.id === over.id);
    if (targetColumn) {
      onDragEnd(active.id, targetColumn.id);
    } else {
      onDragEnd(active.id, "");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {columns.map((column) => (
          <BacklogColumnComponent
            key={column.id}
            id={column.id}
            title={column.title}
            stories={column.stories}
            onEditStory={onEditStory}
            onDeleteStory={onDeleteStory}
          />
        ))}
      </div>

      <DragOverlay>
        {activeStory ? (
          <div className={styles.dragOverlay}>
            <StoryCard story={activeStory} onEdit={() => {}} onDelete={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
