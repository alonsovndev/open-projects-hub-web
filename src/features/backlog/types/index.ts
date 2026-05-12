import type { ProjectPriority } from "@/features/dashboard/types";

export type StoryStatus = "backlog" | "ready" | "in-progress" | "review" | "done";

export interface Story {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: StoryStatus;
  priority: ProjectPriority;
  storyPoints?: number;
  assignee?: string;
  projectId: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BacklogColumn {
  id: StoryStatus;
  title: string;
  stories: Story[];
}

export interface BacklogFilters {
  search: string;
  project: string;
  priority: ProjectPriority | "all";
  assignee: string;
}
