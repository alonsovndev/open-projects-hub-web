import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { getErrorMessage } from "@/shared/types/api";
import { ERROR_MESSAGES } from "@/shared/utils/error-messages";
import {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useArchiveProjectMutation,
  useReactivateProjectMutation,
  useRegenerateAccessCodeMutation,
} from "@/features/projects/api/projects-api";
import { useDeleteProject } from "@/features/projects/hooks/use-delete-project";
import { useUpdateProject } from "@/features/projects/hooks/use-update-project";
import type { ProjectFilters, ProjectSort, ProjectView } from "@/features/projects/types";
import { buildClientReviewUrl } from "@/features/viewer/model/client-review-link";

/** Maximum number of concurrently active projects allowed (MVP constraint). */
export const MAX_ACTIVE_PROJECTS = 3;
export const ACTIVE_LIMIT_MESSAGE = ERROR_MESSAGES.projectLimit;

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
  const [reactivateProject, { isLoading: isReactivating }] = useReactivateProjectMutation();
  const [regenerateAccessCode, { isLoading: isRegeneratingAccessCode }] =
    useRegenerateAccessCodeMutation();

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

  // Fetch projects using RTK Query — filters are forwarded to the server so pagination
  // and results stay consistent once the dataset exceeds a single page.
  const { data, isLoading, error } = useGetProjectsQuery({
    page: currentPage,
    limit: pageSize,
    status: filters.status !== "all" ? filters.status : undefined,
    clientId: filters.clientId !== "all" ? filters.clientId : undefined,
    search: filters.search || undefined,
    startDate: filters.dateRange?.[0],
    endDate: filters.dateRange?.[1],
  });

  // Fetch project details for editing
  const { data: editingProject } = useGetProjectByIdQuery(editingProjectId ?? "", {
    skip: !editingProjectId,
  });

  // Active count for the limit guard must reflect ALL active projects, independent of the
  // main list's filters/pagination above — otherwise filtering (e.g. by status=archived)
  // would make activeCount read as 0 and silently bypass the create-limit guard.
  const { data: activeCountData } = useGetProjectsQuery({ status: "active", limit: 1 });

  const totalCount = data?.total ?? 0;
  const allProjects = useMemo(() => data?.projects ?? [], [data?.projects]);
  const activeCount = activeCountData?.total ?? 0;
  const canCreate = activeCount < MAX_ACTIVE_PROJECTS;

  // Priority filtering stays client-side — the backend's filter endpoint (BE-004) supports
  // status/client/date/search only, not priority. Every other filter is forwarded to the
  // server above so it applies across the full dataset, not just the current page.
  const filteredProjects = useMemo(() => {
    if (filters.priority === "all") return allProjects;
    return allProjects.filter((project) => project.priority === filters.priority);
  }, [allProjects, filters.priority]);

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
        case "endDate": {
          // Undated projects compare as the latest possible end date (last when ascending).
          const endTime = (endDate?: string) =>
            endDate ? new Date(endDate).getTime() : Number.MAX_SAFE_INTEGER;
          compareValue = endTime(a.endDate) - endTime(b.endDate);
          break;
        }
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

  const handleViewProject = (accessCode: string) => {
    window.open(buildClientReviewUrl(accessCode), "_blank", "noopener,noreferrer");
  };

  const handleRegenerateAccessCode = async () => {
    if (!editingProjectId) return;
    try {
      await regenerateAccessCode(editingProjectId).unwrap();
      message.success("New access code generated. The previous code no longer works.");
    } catch {
      message.error("We couldn't generate a new access code. Please try again.");
    }
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
      title: "Archive project",
      icon: <ExclamationCircleOutlined />,
      content: `Archive "${projectName}"? It will be moved out of the active list. You can still view it by filtering for Archived.`,
      okText: "Archive",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await archiveProject(projectId).unwrap();
          message.success(`Project "${projectName}" archived.`);
        } catch (error) {
          const msg = getErrorMessage(error, "We couldn't archive the project. Please try again.");
          message.error(msg);
        }
      },
    });
  };

  const handleReactivateProject = (projectId: string, projectName: string) => {
    Modal.confirm({
      title: "Reactivate project",
      icon: <ExclamationCircleOutlined />,
      content: `Reactivate "${projectName}"? It will count toward your ${MAX_ACTIVE_PROJECTS} active projects.`,
      okText: "Reactivate",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await reactivateProject(projectId).unwrap();
          message.success(`Project "${projectName}" reactivated.`);
        } catch (error) {
          const apiError = error as { status?: number };
          message.error(
            apiError?.status === 409
              ? "You have reached the maximum of 3 active projects. Archive another project before reactivating this one."
              : getErrorMessage(error, "We couldn't reactivate the project. Please try again.")
          );
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
    isReactivating,
    isRegeneratingAccessCode,
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
    handleRegenerateAccessCode,
    handleEditProject,
    handleUpdateProject,
    handleCancelEdit,
    handleCreateProject,
    handleDeleteProject,
    handleArchiveProject,
    handleReactivateProject,
  };
};
