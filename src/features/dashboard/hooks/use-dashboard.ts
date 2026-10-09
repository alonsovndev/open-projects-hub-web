import { useNavigate } from "react-router-dom";

import {
  useGetProjectsQuery,
  useGetDashboardStatsQuery,
} from "@/features/projects/api/projects-api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { buildClientReviewUrl } from "@/features/viewer/model/client-review-link";

/**
 * Dashboard data (recent projects and workspace stats) and navigation handlers.
 */
export const useDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch projects and stats using RTK Query
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useGetProjectsQuery({ page: 1, limit: 10 });

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetDashboardStatsQuery();

  const loading = projectsLoading || statsLoading;
  const projects = projectsData?.projects ?? [];
  const stats = statsData ?? null;

  const hasError = Boolean(projectsError || statsError);

  const handleViewProject = (accessCode: string) => {
    window.open(buildClientReviewUrl(accessCode), "_blank", "noopener,noreferrer");
  };

  const handleCreateProject = () => {
    navigate("/projects/new");
  };

  const handleViewAllProjects = () => {
    navigate("/projects");
  };

  return {
    user,
    projects,
    stats,
    loading,
    hasError,
    handleViewProject,
    handleCreateProject,
    handleViewAllProjects,
  };
};
