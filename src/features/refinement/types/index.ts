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

export interface UpdateDraftPayload {
  title?: string;
  description?: string;
  acceptanceCriteria?: string[];
}

export interface GeneratedStory {
  id: string; // Draft ID
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export interface GenerateStoriesPayload {
  projectId: string;
  rawNotes: string;
}

export interface GenerateStoriesResponse {
  stories: GeneratedStory[];
  rawNotes: string;
  /** How many markup or injection payloads the API neutralized before refining. */
  redactionCount: number;
}

export interface ApproveDraftsBulkPayload {
  draftIds: string[];
}

export interface ApproveDraftsBulkResponse {
  approvedCount: number;
  stories: Array<{ id: string; title: string }>;
}
