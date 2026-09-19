/**
 * Dashboard feature types
 * Re-exports shared domain types for convenience
 */

// Re-export shared domain types
export type {
  ProjectStatus,
  ProjectPriority,
  ProjectPhase,
  ProjectSummary,
  DashboardStats,
} from "@/shared/types/domain";
export { PROJECT_STATUS_COLORS, PROJECT_PRIORITY_COLORS } from "@/shared/types/domain";

// Dashboard-specific types
export interface AdminWelcomePanel {
  id: string;
  title: string;
  description: string;
  status: string;
}
