/**
 * Shared domain types used across multiple features
 * Extracted to avoid duplication and maintain consistency
 */

export type ProjectStatus = "active" | "completed" | "on-hold" | "planning";
export type ProjectPriority = "high" | "medium" | "low";

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  client: string;
  storiesCount: number;
  completedStories: number;
  dueDate: string;
  lastUpdated: string;
  description: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalStories: number;
  completedStories: number;
}

/**
 * Status color mappings for UI consistency
 * Use these constants instead of hard-coding colors
 */
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  active: "processing",
  completed: "success",
  "on-hold": "warning",
  planning: "default",
};

/**
 * Priority color mappings for UI consistency
 * Use these constants instead of hard-coding colors
 */
export const PROJECT_PRIORITY_COLORS: Record<ProjectPriority, string> = {
  high: "red",
  medium: "orange",
  low: "blue",
};
