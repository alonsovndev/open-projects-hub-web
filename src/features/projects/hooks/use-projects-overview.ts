import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { getProjects } from "@/features/dashboard/api/projects-data";
import type { ProjectFilters, ProjectSort, ProjectView } from "@/features/projects/types";

export const useProjectsOverview = () => {
  const navigate = useNavigate();
  const allProjects = getProjects();

  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: "all",
    priority: "all",
  });

  const [sort, setSort] = useState<ProjectSort>({
    field: "lastUpdated",
    order: "desc",
  });

  const [view, setView] = useState<ProjectView>("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter projects
  const filteredProjects = useMemo(() => {
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
  }, [allProjects, filters]);

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
        case "dueDate":
          compareValue = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
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
    // TODO: Navigate to project edit page
    navigate(`/projects/${projectId}/edit`);
  };

  const handleCreateProject = () => {
    // TODO: Navigate to project creation page
    navigate("/projects/new");
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
    totalCount: allProjects.length,
    filteredCount: sortedProjects.length,
    activeFilterCount,
    handleSearchChange,
    handleStatusFilter,
    handlePriorityFilter,
    handleSortChange,
    handleViewChange,
    handleClearFilters,
    handlePageChange,
    handleViewProject,
    handleEditProject,
    handleCreateProject,
  };
};
