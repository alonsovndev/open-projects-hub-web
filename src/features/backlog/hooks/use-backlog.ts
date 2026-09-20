import { useState, useMemo } from "react";
import { message } from "antd";

import type { BacklogFilters } from "@/features/backlog/types";
import type { ProjectPriority } from "@/features/dashboard/types";
import { useGetStoriesQuery, useDeleteStoryMutation } from "@/features/backlog/api/stories-api";
import { useBacklogExport } from "@/features/backlog/hooks/use-backlog-export";
import { useGetProjectsQuery } from "@/features/projects/api/projects-api";
import type { ProjectSummary } from "@/shared/types/domain";

export const useBacklog = () => {
  const { data, isLoading, error } = useGetStoriesQuery({});
  const [deleteStoryMutation] = useDeleteStoryMutation();
  const { exportBacklog, isExporting } = useBacklogExport();

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery({
    limit: 100,
  });

  const projectOptions =
    projectsData?.projects.map((p: ProjectSummary) => ({
      label: `${p.name} (${p.code})`,
      value: p.id,
    })) ?? [];

  const [filters, setFilters] = useState<BacklogFilters>({
    search: "",
    project: "all",
    priority: "all",
  });

  // Filter stories
  const filteredStories = useMemo(() => {
    const stories = data?.stories ?? [];
    return stories.filter((story) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          story.title.toLowerCase().includes(searchLower) ||
          story.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Project filter
      if (filters.project !== "all" && story.projectId !== filters.project) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && story.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [data?.stories, filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.project !== "all") count++;
    if (filters.priority !== "all") count++;
    return count;
  }, [filters]);

  const handleDeleteStory = async (storyId: string) => {
    try {
      await deleteStoryMutation(storyId).unwrap();
      message.success("Story deleted successfully");
    } catch (error) {
      console.error("Failed to delete story:", error);
      message.error("Failed to delete story. Please try again.");
    }
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleProjectFilter = (project: string) => {
    setFilters((prev) => ({ ...prev, project }));
  };

  const handlePriorityFilter = (priority: ProjectPriority | "all") => {
    setFilters((prev) => ({ ...prev, priority }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      project: "all",
      priority: "all",
    });
  };

  // The export endpoint is project-scoped, so the all-projects view can only export the
  // project the filter bar currently names.
  const exportProjectId = filters.project === "all" ? null : filters.project;

  // Search and priority are applied in the browser; the server knows nothing about them.
  // Exporting under those filters would hand back the whole project backlog while the
  // screen shows a narrowed list, so the export is held until they are cleared rather than
  // quietly returning something other than what the Admin is looking at.
  const hasClientOnlyFilters = filters.search !== "" || filters.priority !== "all";

  const exportBlockedReason = !exportProjectId
    ? "Select a project to export its backlog"
    : hasClientOnlyFilters
      ? "Exports cover a whole project. Clear the search and priority filters first."
      : null;

  const handleExportMarkdown = async () => {
    // The button is disabled in this state, so this is the keyboard/programmatic path —
    // still say why rather than appearing to do nothing.
    if (exportBlockedReason) {
      message.warning(exportBlockedReason);
      return;
    }

    await exportBacklog(exportProjectId);
  };

  return {
    filteredStories,
    filters,
    activeFilterCount,
    isLoading,
    isLoadingProjects,
    isExporting,
    canExport: exportBlockedReason === null,
    exportBlockedReason,
    error,
    projectOptions,
    handleDeleteStory,
    handleSearchChange,
    handleProjectFilter,
    handlePriorityFilter,
    handleClearFilters,
    handleExportMarkdown,
  };
};
