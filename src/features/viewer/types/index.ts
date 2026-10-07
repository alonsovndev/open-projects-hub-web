import type { StoryStatus } from "@/features/backlog/types";
import type { ProjectPhase, ProjectPriority } from "@/features/dashboard/types";

export interface ReviewStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: StoryStatus;
  priority: ProjectPriority;
}

export interface ClientReview {
  projectName: string;
  phase: ProjectPhase;
  total: number;
  stories: ReviewStory[];
}

export interface ProjectCodeFormValues {
  projectCode: string;
}
