import { useState } from "react";
import { message } from "antd";

import {
  useGenerateStoriesMutation,
  useApproveStoryMutation,
  useApproveStoriesBulkMutation,
} from "@/features/refinement/api/refinement-api";
import { useGetProjectsQuery } from "@/features/projects/api/projects-api";
import {
  useGetApiKeysQuery,
  useGetCreditBalanceQuery,
} from "@/features/settings/api/ai-providers-api";
import type { AiProvider, ProviderErrorDetail, RefinementProvider } from "@/shared/types/ai";
import type { ProjectSummary } from "@/shared/types/domain";
import {
  RAW_NOTES_MAX_LENGTH,
  RAW_NOTES_MIN_LENGTH,
  type GeneratedStory,
  type RefinementFailure,
  type RefinementFailureClass,
} from "@/features/refinement/types";

/**
 * Read the API's 502 refinement-failure body, which carries the notes back.
 *
 * Returns null for any other error shape so the caller can fall back to a generic
 * message rather than showing a retry button that would resubmit nothing.
 */
const FAILURE_CLASSES: readonly RefinementFailureClass[] = [
  "timeout",
  "provider_error",
  "invalid_response",
];

const toRefinementFailure = (error: unknown): RefinementFailure | null => {
  if (!error || typeof error !== "object") return null;

  // Only the documented 502 body carries preserved notes; anything else that happens to
  // have a `rawNotes` field must not be allowed to drive the retry path.
  const { status, data } = error as { status?: unknown; data?: unknown };
  if (status !== 502 || !data || typeof data !== "object") return null;

  const body = data as Partial<RefinementFailure>;
  const isFailureClass = FAILURE_CLASSES.includes(body.failureClass as RefinementFailureClass);

  return typeof body.rawNotes === "string" && typeof body.detail === "string" && isFailureClass
    ? (body as RefinementFailure)
    : null;
};

/**
 * Read the 422 body the API returns when a provider refuses a key.
 *
 * `promptsKeyUpdate` is the part that matters: it separates a key the user must replace
 * in Settings (FR-010-11) from a spent quota or an outage, which replacing would not fix.
 */
const toProviderKeyError = (error: unknown): ProviderErrorDetail | null => {
  if (!error || typeof error !== "object") return null;

  const { status, data } = error as { status?: unknown; data?: unknown };
  if (status !== 422 || !data || typeof data !== "object") return null;

  const body = data as ProviderErrorDetail;
  return body.code === "API_KEY_INVALID" ? body : null;
};

/** True when the API refused the run because the free credits are gone (FR-010-03). */
const isCreditsExhausted = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { status?: unknown }).status === 402;

export const useRefinement = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [rawNotes, setRawNotes] = useState<string>("");
  const [generatedStories, setGeneratedStories] = useState<GeneratedStory[]>([]);
  // The project the stories were generated for. Approval must target it, not whatever the
  // project dropdown shows by then.
  const [generatedProjectId, setGeneratedProjectId] = useState<string>("");
  const [approvingIds, setApprovingIds] = useState<string[]>([]);
  const [editingStory, setEditingStory] = useState<GeneratedStory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<GeneratedStory | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [redactionCount, setRedactionCount] = useState(0);
  // Session-scoped only: Q-031 rules out remembering the last provider across visits.
  const [selectedProvider, setSelectedProvider] = useState<RefinementProvider | null>(null);
  const [creditsExhausted, setCreditsExhausted] = useState(false);
  const [invalidKeyProvider, setInvalidKeyProvider] = useState<AiProvider | null>(null);

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery({
    limit: 100,
  });

  const { data: creditBalance } = useGetCreditBalanceQuery();
  const { data: apiKeys } = useGetApiKeysQuery();

  const [generateStories, { isLoading: isGenerating }] = useGenerateStoriesMutation();
  const [approveStory] = useApproveStoryMutation();
  const [approveStoriesBulk, { isLoading: isApprovingAll }] = useApproveStoriesBulkMutation();

  const projectOptions =
    projectsData?.projects.map((p: ProjectSummary) => ({
      label: `${p.name} (${p.code})`,
      value: p.id,
    })) ?? [];

  const selectedProject = projectsData?.projects.find((p) => p.id === selectedProjectId) ?? null;

  const configuredProviders: AiProvider[] = (apiKeys ?? [])
    .map((key) => key.provider)
    .sort((left, right) => left.localeCompare(right));
  const hasCredits = (creditBalance?.credits ?? 0) > 0;

  // "Platform" is offered only while credits remain; the rest are the providers the user
  // actually holds a key for (FR-010-06).
  const providerOptions: RefinementProvider[] = [
    ...(hasCredits ? (["platform"] as const) : []),
    ...configuredProviders,
  ];

  // Default: Platform when there are credits, otherwise the first configured provider
  // alphabetically. Held as a derived value rather than seeded into state so it tracks a
  // key being added or deleted in another tab without a stale selection surviving.
  const effectiveProvider: RefinementProvider | null =
    selectedProvider !== null && providerOptions.includes(selectedProvider)
      ? selectedProvider
      : (providerOptions[0] ?? null);

  // FR-010-03: no credits and no key means there is nothing to run the refinement on.
  const isRefinementBlocked = providerOptions.length === 0;

  // A past failure says nothing about notes the Admin has since changed, so the alert and
  // its Retry button clear as soon as the input does.
  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setGenerationError(null);
  };

  const handleNotesChange = (notes: string) => {
    setRawNotes(notes);
    setGenerationError(null);
  };

  const runGeneration = async (notes: string) => {
    setGenerationError(null);
    setRedactionCount(0);

    try {
      const result = await generateStories({
        projectId: selectedProjectId,
        rawNotes: notes,
        ...(effectiveProvider !== null && { provider: effectiveProvider }),
      }).unwrap();

      // The API stores nothing, so the ids are only list keys for this session.
      const batchKey = Date.now();
      setGeneratedStories(
        result.stories.map((story, index) => ({ ...story, id: `${batchKey}-${index}` }))
      );
      setGeneratedProjectId(selectedProjectId);
      setRedactionCount(result.redactionCount ?? 0);
      message.success(`Generated ${result.stories.length} stories successfully!`);
    } catch (error) {
      if (isCreditsExhausted(error)) {
        // Not shown as a generic failure: this one has a specific remedy, so it gets the
        // add-a-key prompt instead of a Retry button that would fail the same way.
        setCreditsExhausted(true);
        return;
      }

      const keyError = toProviderKeyError(error);
      if (keyError?.promptsKeyUpdate && keyError.provider) {
        setInvalidKeyProvider(keyError.provider);
        return;
      }

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

    if (isRefinementBlocked) {
      setCreditsExhausted(true);
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

  const handleRequestApproval = (storyId: string) => {
    const story = generatedStories.find((candidate) => candidate.id === storyId);
    if (story) setPendingApproval(story);
  };

  const handleCancelApproval = () => {
    setPendingApproval(null);
  };

  const handleConfirmApproval = async () => {
    if (!pendingApproval) return;

    const { id: storyId, ...content } = pendingApproval;
    setApprovingIds((prev) => [...prev, storyId]);

    try {
      const result = await approveStory({ projectId: generatedProjectId, ...content }).unwrap();

      setGeneratedStories((prev) => prev.filter((story) => story.id !== storyId));
      message.success(`Story "${result.title}" approved and added to backlog!`);
    } catch (error) {
      message.error("Failed to approve story. Please try again.");
      console.error("Approve story error:", error);
    } finally {
      // The dialog stays open until the request settles, so its confirm button can show
      // progress and a second click cannot land while the first is in flight.
      setPendingApproval(null);
      setApprovingIds((prev) => prev.filter((id) => id !== storyId));
    }
  };

  const handleApproveAll = async () => {
    if (generatedStories.length === 0) {
      message.warning("No stories to approve");
      return;
    }

    try {
      const stories = generatedStories.map(({ id: _localId, ...content }) => ({
        projectId: generatedProjectId,
        ...content,
      }));
      const result = await approveStoriesBulk({ stories }).unwrap();

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

  const handleEdit = (storyId: string) => {
    const story = generatedStories.find((candidate) => candidate.id === storyId);
    if (!story) return;

    setEditingStory(story);
    setIsEditModalOpen(true);
  };

  // Edits stay in the browser: the story is saved only when it is approved.
  const handleSaveEdit = (updatedStory: GeneratedStory) => {
    setGeneratedStories((prev) =>
      prev.map((story) => (story.id === updatedStory.id ? updatedStory : story))
    );

    setIsEditModalOpen(false);
    setEditingStory(null);
    message.success("Story updated successfully!");
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingStory(null);
  };

  const handleDelete = (storyId: string) => {
    setGeneratedStories((prev) => prev.filter((story) => story.id !== storyId));
    message.success("Draft discarded");
  };

  return {
    creditBalance: creditBalance ?? null,
    providerOptions,
    selectedProvider: effectiveProvider,
    setSelectedProvider,
    isRefinementBlocked,
    creditsExhausted,
    dismissCreditsExhausted: () => setCreditsExhausted(false),
    invalidKeyProvider,
    dismissInvalidKey: () => setInvalidKeyProvider(null),
    selectedProjectId,
    selectedProject,
    rawNotes,
    generatedStories,
    approvingIds,
    editingStory,
    isEditModalOpen,
    pendingApproval,
    generationError,
    redactionCount,
    projectOptions,
    isLoadingProjects,
    isGenerating,
    isApprovingAll,
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
