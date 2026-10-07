import type { RefinementProvider } from "@/shared/types/ai";

/** Mirrors the backend's documented refinement input bounds (FR-002-06). */
export const RAW_NOTES_MIN_LENGTH = 20;
export const RAW_NOTES_MAX_LENGTH = 5000;

export type RefinementFailureClass = "timeout" | "provider_error" | "invalid_response";

/**
 * Body of the 502 the API returns when a provider fails.
 *
 * `rawNotes` is the Admin's own input echoed back, so a retry never asks them to
 * retype anything.
 */
export interface RefinementFailure {
  detail: string;
  failureClass: RefinementFailureClass;
  provider: string;
  rawNotes: string;
}

/** A refined story as the API returns it: content only, since nothing is stored yet. */
export interface RefinedStory {
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

/** A refined story held in the client until approved; `id` is a local key, not a server id. */
export interface GeneratedStory extends RefinedStory {
  id: string;
}

export interface GenerateStoriesPayload {
  projectId: string;
  rawNotes: string;
  /** Which provider serves this run. Omitted means the platform's free credits. */
  provider?: RefinementProvider;
}

export interface GenerateStoriesResponse {
  stories: RefinedStory[];
  rawNotes: string;
  /** How many markup or injection payloads the API neutralized before refining. */
  redactionCount: number;
  provider: RefinementProvider;
  /** Null when the user's own key served the run and no credit was spent (FR-010-08). */
  creditsRemaining: number | null;
}

/** Approval carries the content because refined stories are not stored before approval. */
export interface ApproveStoryPayload extends RefinedStory {
  projectId: string;
}

export interface ApproveStoriesBulkPayload {
  stories: ApproveStoryPayload[];
}

export interface ApproveStoriesBulkResponse {
  approvedCount: number;
  stories: Array<{ id: string; title: string }>;
}
