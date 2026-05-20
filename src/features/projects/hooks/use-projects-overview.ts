import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useGetProjectsQuery, useGetProjectByIdQuery } from "@/features/projects/api/projects-api";
import { useDeleteProject } from "@/features/projects/hooks/use-delete-project";
import { useUpdateProject } from "@/features/projects/hooks/use-update-project";
import type { ProjectFilters, ProjectSort, ProjectView } from "@/features/projects/types";

export const useProjectsOverview = () => {
  const navigate = useNavigate();
  const { deleteProject, isDeleting } = useDeleteProject();
  const { updateProject, isUpdating } = useUpdateProject({
    onSuccess: () => {
      setEditModalOpen(false);
      setEditingProjectId(null);
    },
  });

  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: "all",
    priority: "all",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [sort, setSort] = useState<ProjectSort>({
    field: "lastUpdated",
    order: "desc",
  });

  const [view, setView] = useState<ProjectView>("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch projects using RTK Query
  const { data, isLoading, error } = useGetProjectsQuery({
    page: currentPage,
    limit: pageSize,
  });

  // Fetch project details for editing
  const { data: editingProject } = useGetProjectByIdQuery(editingProjectId ?? "", {
    skip: !editingProjectId,
  });

  const totalCount = data?.total ?? 0;

  // Filter projects
  const filteredProjects = useMemo(() => {
    const allProjects = data?.projects ?? [];
    return allProjects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          project.name.toLowerCase().includes(searchLower) ||
          project.code.toLowerCase().includes(searchLower) ||
          project.client.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && project.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && project.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [data?.projects, filters]);

  // Sort projects
  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sort.field) {
        case "name":
          compareValue = a.name.localeCompare(b.name);
          break;
        case "status":
          compareValue = a.status.localeCompare(b.status);
          break;
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case "endDate":
          compareValue = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        case "lastUpdated":
          compareValue = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }

      return sort.order === "asc" ? compareValue : -compareValue;
    });

    return sorted;
  }, [filteredProjects, sort]);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleStatusFilter = (status: ProjectFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePriorityFilter = (priority: ProjectFilters["priority"]) => {
    setFilters((prev) => ({ ...prev, priority }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (field: ProjectSort["field"]) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewChange = (newView: ProjectView) => {
    setView(newView);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priority: "all",
    });
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when changing page size
    }
  };

  const handleViewProject = (projectCode: string) => {
    navigate(`/viewer/${projectCode}`);
  };

  const handleEditProject = (projectId: string) => {
    setEditingProjectId(projectId);
    setEditModalOpen(true);
  };

  const handleUpdateProject = async (data: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    if (editingProjectId) {
      await updateProject(editingProjectId, data);
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditingProjectId(null);
  };

  const handleCreateProject = () => {
    navigate("/projects/new");
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    deleteProject(projectId, projectName);
  };

  const activeFilterCount = [
    filters.search !== "",
    filters.status !== "all",
    filters.priority !== "all",
  ].filter(Boolean).length;

  return {
    projects: sortedProjects,
    filters,
    sort,
    view,
    currentPage,
    pageSize,
    totalCount,
    filteredCount: sortedProjects.length,
    activeFilterCount,
    isLoading,
    isDeleting,
    isUpdating,
    error,
    editModalOpen,
    editingProject,
    handleSearchChange,
    handleStatusFilter,
    handlePriorityFilter,
    handleSortChange,
    handleViewChange,
    handleClearFilters,
    handlePageChange,
    handleViewProject,
    handleEditProject,
    handleUpdateProject,
    handleCancelEdit,
    handleCreateProject,
    handleDeleteProject,
  };
};
