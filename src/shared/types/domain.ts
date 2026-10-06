/**
 * Shared domain types used across multiple features
 * Extracted to avoid duplication and maintain consistency
 */

export type ProjectStatus = "active" | "completed" | "on-hold" | "planning" | "archived";
export type ProjectPriority = "high" | "medium" | "low";
export type ProjectPhase = "discovery" | "planning";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientSummary {
  id: string;
  name: string;
  company?: string;
  email?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  /** What the client types on the Client Review page; not the freelancer-chosen `code`. */
  accessCode: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  phase: ProjectPhase;
  clientId: string;
  clientName: string;
  /** @deprecated Use clientName instead */
  client: string;
  storiesCount: number;
  completedStories: number;
  startDate: string;
  endDate: string;
  createdAt: string;
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
  archived: "default",
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
