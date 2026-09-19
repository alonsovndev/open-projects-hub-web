import type { ProjectStatus, ProjectPriority } from "@/features/dashboard/types";

export type ProjectSortField = "name" | "status" | "priority" | "endDate" | "lastUpdated" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface ProjectFilters {
  search: string;
  status: ProjectStatus | "all";
  priority: ProjectPriority | "all";
  clientId: string | "all";
  dateRange: [string, string] | null;
}

export interface ProjectSort {
  field: ProjectSortField;
  order: SortOrder;
}

export type ProjectView = "grid" | "list";
