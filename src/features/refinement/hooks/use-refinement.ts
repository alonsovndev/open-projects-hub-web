import { useState } from "react";
import { message } from "antd";

import {
  useGenerateStoriesMutation,
  useApproveDraftMutation,
  useApproveDraftsBulkMutation,
  useUpdateDraftMutation,
  useDeleteDraftMutation,
} from "@/features/refinement/api/refinement-api";
import { useGetProjectsQuery } from "@/features/projects/api/projects-api";
import type { ProjectSummary } from "@/shared/types/domain";
import {
  RAW_NOTES_MAX_LENGTH,
  RAW_NOTES_MIN_LENGTH,
  type GeneratedStory,
  type RefinementFailure,
} from "@/features/refinement/types";

/**
 * Read the API's 502 refinement-failure body, which carries the notes back.
 *
 * Returns null for any other error shape so the caller can fall back to a generic
 * message rather than showing a retry button that would resubmit nothing.
 */
const toRefinementFailure = (error: unknown): RefinementFailure | null => {
  if (!error || typeof error !== "object" || !("data" in error)) return null;

  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== "object") return null;

  const body = data as Partial<RefinementFailure>;
  return typeof body.rawNotes === "string" && typeof body.detail === "string"
    ? (body as RefinementFailure)
    : null;
};

export const useRefinement = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [rawNotes, setRawNotes] = useState<string>("");
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([]);
  const [approvingIds, setApprovingIds] = useState<string[]>([]);
  const [editingStory, setEditingStory] = useState<GeneratedStory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<GeneratedStory | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery({
    limit: 100,
  });

  const [generateStories, { isLoading: isGenerating }] = useGenerateStoriesMutation();
  const [approveDraft] = useApproveDraftMutation();
  const [approveDraftsBulk, { isLoading: isApprovingAll }] = useApproveDraftsBulkMutation();
  const [updateDraft, { isLoading: isUpdating }] = useUpdateDraftMutation();
  const [deleteDraft] = useDeleteDraftMutation();

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

  const runGeneration = async (notes: string) => {
    setGenerationError(null);

    try {
      const result = await generateStories({
        projectId: selectedProjectId,
        rawNotes: notes,
      }).unwrap();

      setGeneratedStories(result.stories);
      message.success(`Generated ${result.stories.length} stories successfully!`);
    } catch (error) {
      const failure = toRefinementFailure(error);

      if (failure) {
        // The API preserved the input; put it back in the editor so Retry resubmits it.
        setRawNotes(failure.rawNotes);
        setGenerationError(failure.detail);
        return;
      }

      setGenerationError("Failed to generate stories. Your notes were kept — please try again.");
      console.error("Generate stories error:", error);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      message.error("Please select a project first");
      return;
    }

    if (rawNotes.length < RAW_NOTES_MIN_LENGTH) {
      message.error(`Please enter at least ${RAW_NOTES_MIN_LENGTH} characters of discovery notes`);
      return;
    }

    if (rawNotes.length > RAW_NOTES_MAX_LENGTH) {
      message.error(`Discovery notes cannot exceed ${RAW_NOTES_MAX_LENGTH} characters`);
      return;
    }

    await runGeneration(rawNotes);
  };

  const handleRetryGeneration = async () => {
    await runGeneration(rawNotes);
  };

  const handleDismissError = () => {
    setGenerationError(null);
  };

  const handleRequestApproval = (draftId: string) => {
    const story = generatedStories.find((candidate) => candidate.id === draftId);
    if (story) setPendingApproval(story);
  };

  const handleCancelApproval = () => {
    setPendingApproval(null);
  };

  const handleConfirmApproval = async () => {
    if (!pendingApproval) return;

    const draftId = pendingApproval.id;
    setPendingApproval(null);
    setApprovingIds((prev) => [...prev, draftId]);

    try {
      const result = await approveDraft(draftId).unwrap();

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

  const handleEdit = (draftId: string) => {
    const story = generatedStories.find((candidate) => candidate.id === draftId);
    if (!story) return;

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

  const handleDelete = async (draftId: string) => {
    try {
      // Deleted server-side, not just dropped from the list: an abandoned draft must not
      // linger where a later session could approve it.
      await deleteDraft(draftId).unwrap();

      setGeneratedStories((prev) => prev.filter((story) => story.id !== draftId));
      message.success("Draft discarded");
    } catch (error) {
      message.error("Failed to discard draft. Please try again.");
      console.error("Delete draft error:", error);
    }
  };

  return {
    selectedProjectId,
    selectedProject,
    rawNotes,
    generatedStories,
    approvingIds,
    editingStory,
    isEditModalOpen,
    pendingApproval,
    generationError,
    projectOptions,
    isLoadingProjects,
    isGenerating,
    isApprovingAll,
    isUpdating,
    handleProjectChange,
    handleNotesChange,
    handleGenerate,
    handleRetryGeneration,
    handleDismissError,
    handleRequestApproval,
    handleConfirmApproval,
    handleCancelApproval,
    handleApproveAll,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  };
};
