import type { FC } from "react";
import { memo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

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

const BacklogBoardBase: FC<BacklogBoardProps> = ({
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
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    onDragStart(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      onDragEnd(active.id as string, "");
      return;
    }

    // Check if dropped on a different column
    const targetColumn = columns.find((col) => col.id === over.id);
    if (targetColumn) {
      onDragEnd(active.id as string, targetColumn.id);
    } else {
      onDragEnd(active.id as string, "");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements: {
          onDragStart({ active }) {
            return `Picked up story ${active.id}`;
          },
          onDragOver({ active, over }) {
            if (over) {
              const column = columns.find((col) => col.id === over.id);
              const columnName = column?.title || over.id;
              return `Story ${active.id} is over column ${columnName}`;
            }
            return `Story ${active.id} is no longer over a column`;
          },
          onDragEnd({ active, over }) {
            if (over) {
              const column = columns.find((col) => col.id === over.id);
              const columnName = column?.title || over.id;
              return `Story ${active.id} was dropped in column ${columnName}`;
            }
            return `Story ${active.id} was dropped`;
          },
          onDragCancel({ active }) {
            return `Dragging story ${active.id} was cancelled`;
          },
        },
      }}
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

export const BacklogBoardComponent = memo(BacklogBoardBase);
