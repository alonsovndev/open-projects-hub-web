import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getProjects, getDashboardStats } from "@/features/dashboard/api/projects-data";
import type { ProjectSummary, DashboardStats } from "@/features/dashboard/types";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const useDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const projectsData = getProjects();
      const statsData = getDashboardStats();

      setProjects(projectsData);
      setStats(statsData);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleViewProject = (projectCode: string) => {
    navigate(`/viewer/${projectCode}`);
  };

  const handleCreateProject = () => {
    // TODO: Navigate to project creation page
    console.log("Create new project");
  };

  return {
    user,
    projects,
    stats,
    loading,
    handleViewProject,
    handleCreateProject,
  };
};
