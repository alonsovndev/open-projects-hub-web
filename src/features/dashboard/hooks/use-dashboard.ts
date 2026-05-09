import { useNavigate } from "react-router-dom";

import {
  useGetProjectsQuery,
  useGetDashboardStatsQuery,
} from "@/features/projects/api/projects-api";
import { useAuth } from "@/features/auth/hooks/use-auth";

/**
 * Dashboard hook with RTK Query data fetching
 *
 * Note: Currently using mock data fallback until backend endpoints are ready.
 * When backend is available, remove the mock data imports and fallbacks.
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
  const stats = statsData?.stats ?? null;

  // TODO: Handle errors appropriately
  // For now, errors will show empty states in the UI
  if (projectsError || statsError) {
    // Could dispatch to error tracking service (e.g., Sentry)
  }

  const handleViewProject = (projectCode: string) => {
    navigate(`/viewer/${projectCode}`);
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
    handleViewProject,
    handleCreateProject,
    handleViewAllProjects,
  };
};
