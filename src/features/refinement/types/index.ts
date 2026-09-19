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
}

export interface ApproveDraftsBulkPayload {
  draftIds: string[];
}

export interface ApproveDraftsBulkResponse {
  approvedCount: number;
  stories: Array<{ id: string; title: string }>;
}
