export interface AdminWelcomePanel {
  id: string;
  title: string;
  description: string;
  status: string;
}

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
  teamMembers: number;
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
  teamMembers: number;
}
