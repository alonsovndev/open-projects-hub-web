import { useState, useMemo } from "react";
import { message } from "antd";

import type { BacklogFilters } from "@/features/backlog/types";
import type { ProjectPriority } from "@/features/dashboard/types";
import { useGetStoriesQuery, useDeleteStoryMutation } from "@/features/backlog/api/stories-api";
import { useGetProjectsQuery } from "@/features/projects/api/projects-api";
import type { ProjectSummary } from "@/shared/types/domain";

export const useBacklog = () => {
  const { data, isLoading, error } = useGetStoriesQuery({});
  const [deleteStoryMutation] = useDeleteStoryMutation();

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

  const handleExportMarkdown = () => {
    if (filteredStories.length === 0) {
      message.warning("No stories to export");
      return;
    }

    let markdown = "# User Stories Backlog\n\n";
    markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    markdown += `Total Stories: ${filteredStories.length}\n\n`;
    markdown += "---\n\n";

    filteredStories.forEach((story, index) => {
      markdown += `## ${index + 1}. ${story.title}\n\n`;
      markdown += `**Status:** ${story.status}\n\n`;
      markdown += `**Priority:** ${story.priority}\n\n`;
      if (story.assignee) {
        markdown += `**Assignee:** ${story.assignee}\n\n`;
      }
      if (story.storyPoints) {
        markdown += `**Story Points:** ${story.storyPoints}\n\n`;
      }
      markdown += `### Description\n\n${story.description}\n\n`;

      if (story.acceptanceCriteria && story.acceptanceCriteria.length > 0) {
        markdown += `### Acceptance Criteria\n\n`;
        story.acceptanceCriteria.forEach((criteria, i) => {
          markdown += `${i + 1}. ${criteria}\n`;
        });
        markdown += "\n";
      }

      markdown += "---\n\n";
    });

    // Create and download file
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backlog-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    message.success("Backlog exported successfully!");
  };

  return {
    filteredStories,
    filters,
    activeFilterCount,
    isLoading,
    isLoadingProjects,
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
