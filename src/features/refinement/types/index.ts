export interface StoryDraft {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  status: "draft" | "refining" | "refined" | "approved";
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AISuggestion {
  id: string;
  type: "title" | "description" | "criteria" | "complete";
  content: string;
  reasoning?: string;
  confidence: number;
}

export interface RefinementSession {
  id: string;
  storyId: string;
  suggestions: AISuggestion[];
  feedback: string[];
  status: "active" | "completed" | "cancelled";
  startedAt: string;
  completedAt?: string;
}
