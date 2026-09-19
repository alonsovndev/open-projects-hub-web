import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useArchiveProjectMutation,
} from "@/features/projects/api/projects-api";
import { useDeleteProject } from "@/features/projects/hooks/use-delete-project";
import { useUpdateProject } from "@/features/projects/hooks/use-update-project";
import type { ProjectFilters, ProjectSort, ProjectView } from "@/features/projects/types";

/** Maximum number of concurrently active projects allowed (MVP constraint). */
export const MAX_ACTIVE_PROJECTS = 3;
export const ACTIVE_LIMIT_MESSAGE =
  "You have reached the maximum of 3 active projects. Archive a project before creating a new one.";

export const useProjectsOverview = () => {
  const navigate = useNavigate();
  const { deleteProject, isDeleting } = useDeleteProject();
  const { updateProject, isUpdating } = useUpdateProject({
    onSuccess: () => {
      setEditModalOpen(false);
      setEditingProjectId(null);
    },
  });
  const [archiveProject, { isLoading: isArchiving }] = useArchiveProjectMutation();

  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: "all",
    priority: "all",
    clientId: "all",
    dateRange: null,
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

  // Derived counts — needed for limit guard
  const allProjects = useMemo(() => data?.projects ?? [], [data?.projects]);
  const activeCount = useMemo(
    () => allProjects.filter((p) => p.status === "active").length,
    [allProjects]
  );
  const canCreate = activeCount < MAX_ACTIVE_PROJECTS;

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

      // Client filter
      if (filters.clientId !== "all" && project.clientId !== filters.clientId) {
        return false;
      }

      // Date filter (on createdAt, inclusive)
      if (filters.dateRange) {
        const [start, end] = filters.dateRange;
        const created = new Date(project.createdAt).getTime();
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        if (created < startTime || created > endTime) return false;
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
        case "endDate":
          compareValue = new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
          break;
        case "lastUpdated":
          compareValue = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        case "createdAt":
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
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

  const handleClientFilter = (clientId: ProjectFilters["clientId"]) => {
    setFilters((prev) => ({ ...prev, clientId }));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dateRange: ProjectFilters["dateRange"]) => {
    setFilters((prev) => ({ ...prev, dateRange }));
    setCurrentPage(1);
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
      clientId: "all",
      dateRange: null,
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
    if (!canCreate) {
      Modal.warning({
        title: "Active project limit reached",
        content: ACTIVE_LIMIT_MESSAGE,
      });
      return;
    }
    navigate("/projects/new");
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    deleteProject(projectId, projectName);
  };

  const handleArchiveProject = (projectId: string, projectName: string) => {
    Modal.confirm({
      title: "Archive Project",
      icon: <ExclamationCircleOutlined />,
      content: `Archive "${projectName}"? It will be moved out of the active list. You can still view it by filtering for Archived.`,
      okText: "Archive",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await archiveProject(projectId).unwrap();
          message.success(`Project "${projectName}" archived`);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Failed to archive project";
          message.error(msg);
        }
      },
    });
  };

  const activeFilterCount = [
    filters.search !== "",
    filters.status !== "all",
    filters.priority !== "all",
    filters.clientId !== "all",
    filters.dateRange !== null,
  ].filter((v) => Boolean(v)).length;

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
    activeCount,
    canCreate,
    isLoading,
    isDeleting,
    isUpdating,
    isArchiving,
    error,
    editModalOpen,
    editingProject,
    handleSearchChange,
    handleStatusFilter,
    handlePriorityFilter,
    handleClientFilter,
    handleDateRangeChange,
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
    handleArchiveProject,
  };
};
