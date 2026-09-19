import { useState } from "react";
import { message } from "antd";

import {
  useGenerateStoriesMutation,
  useApproveDraftMutation,
  useApproveDraftsBulkMutation,
  useUpdateDraftMutation,
} from "@/features/refinement/api/refinement-api";
import { useGetProjectsQuery } from "@/features/projects/api/projects-api";
import type { ProjectSummary } from "@/shared/types/domain";
import type { GeneratedStory } from "@/features/refinement/types";

export const useRefinement = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [rawNotes, setRawNotes] = useState<string>("");
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([]);
  const [approvingIds, setApprovingIds] = useState<string[]>([]);
  const [editingStory, setEditingStory] = useState<GeneratedStory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery({
    limit: 100,
  });

  const [generateStories, { isLoading: isGenerating }] = useGenerateStoriesMutation();
  const [approveDraft] = useApproveDraftMutation();
  const [approveDraftsBulk, { isLoading: isApprovingAll }] = useApproveDraftsBulkMutation();
  const [updateDraft, { isLoading: isUpdating }] = useUpdateDraftMutation();

  const projectOptions =
    projectsData?.projects.map((p: ProjectSummary) => ({
      label: `${p.name} (${p.code})`,
      value: p.id,
    })) ?? [];

  const selectedProject = projectsData?.projects.find((p) => p.id === selectedProjectId) ?? null;

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleNotesChange = (notes: string) => {
    setRawNotes(notes);
  };

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      message.error("Please select a project first");
      return;
    }

    if (!rawNotes || rawNotes.length < 20) {
      message.error("Please enter at least 20 characters of discovery notes");
      return;
    }

    try {
      const result = await generateStories({
        projectId: selectedProjectId,
        rawNotes,
      }).unwrap();

      setGeneratedStories(result.stories);
      message.success(`Generated ${result.stories.length} stories successfully!`);
    } catch (error) {
      message.error("Failed to generate stories. Please try again.");
      console.error("Generate stories error:", error);
    }
  };

  const handleApprove = async (draftId: string) => {
    setApprovingIds((prev) => [...prev, draftId]);

    try {
      const result = await approveDraft(draftId).unwrap();

      // Remove from generated stories list
      setGeneratedStories((prev) => prev.filter((story) => story.id !== draftId));

      message.success(`Story "${result.title}" approved and added to backlog!`);
    } catch (error) {
      message.error("Failed to approve story. Please try again.");
      console.error("Approve draft error:", error);
    } finally {
      setApprovingIds((prev) => prev.filter((id) => id !== draftId));
    }
  };

  const handleApproveAll = async () => {
    if (generatedStories.length === 0) {
      message.warning("No stories to approve");
      return;
    }

    try {
      const draftIds = generatedStories.map((story) => story.id);
      const result = await approveDraftsBulk({ draftIds }).unwrap();

      // Clear the list
      setGeneratedStories([]);

      message.success(
        `Successfully approved ${result.approvedCount} ${
          result.approvedCount === 1 ? "story" : "stories"
        }!`
      );
    } catch (error) {
      message.error("Failed to approve all stories. Please try again.");
      console.error("Approve all error:", error);
    }
  };

  const handleEdit = (index: number) => {
    const story = generatedStories[index];
    setEditingStory(story);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedStory: GeneratedStory) => {
    try {
      await updateDraft({
        id: updatedStory.id,
        data: {
          title: updatedStory.title,
          description: updatedStory.description,
          acceptanceCriteria: updatedStory.acceptanceCriteria,
        },
      }).unwrap();

      // Update local state
      setGeneratedStories((prev) =>
        prev.map((story) => (story.id === updatedStory.id ? updatedStory : story))
      );

      setIsEditModalOpen(false);
      setEditingStory(null);
      message.success("Story updated successfully!");
    } catch (error) {
      message.error("Failed to update story. Please try again.");
      console.error("Update draft error:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingStory(null);
  };

  const handleDelete = (index: number) => {
    const updatedStories = generatedStories.filter((_, i) => i !== index);
    setGeneratedStories(updatedStories);
    message.success("Story removed");
  };

  return {
    selectedProjectId,
    selectedProject,
    rawNotes,
    generatedStories,
    approvingIds,
    editingStory,
    isEditModalOpen,
    projectOptions,
    isLoadingProjects,
    isGenerating,
    isApprovingAll,
    isUpdating,
    handleProjectChange,
    handleNotesChange,
    handleGenerate,
    handleApprove,
    handleApproveAll,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  };
};
