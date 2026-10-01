import { isDev } from "@/config/env";
import type { GeneratedStory } from "@/features/refinement/types";

const KEY_PREFIX = "open-projects-hub.refinement-pending";

export interface PendingStories {
  /** The project the stories were generated for; approval must target it. */
  projectId: string;
  stories: GeneratedStory[];
}

// Keyed by account so a second sign-in in the same tab never sees another user's stories.
const keyFor = (owner: string) => `${KEY_PREFIX}.${owner}`;

const isGeneratedStory = (value: unknown): value is GeneratedStory => {
  if (!value || typeof value !== "object") return false;
  const story = value as Partial<GeneratedStory>;

  return (
    typeof story.id === "string" &&
    typeof story.title === "string" &&
    typeof story.description === "string" &&
    Array.isArray(story.acceptanceCriteria) &&
    story.acceptanceCriteria.every((criterion) => typeof criterion === "string")
  );
};

const reportFailure = (action: string, error: unknown) => {
  if (isDev) {
    console.error(`Failed to ${action} pending refinement stories:`, error);
  }
};

/**
 * Unapproved stories are never stored server-side (ADR-019); this keeps them in the browser
 * tab so a reload does not cost the Admin the output of a paid run. sessionStorage rather
 * than localStorage on purpose: unapproved AI output should not outlive the tab.
 */
export const pendingStoriesStorage = {
  load: (owner: string): PendingStories | null => {
    try {
      const raw = window.sessionStorage.getItem(keyFor(owner));
      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;

      const { projectId, stories } = parsed as Partial<PendingStories>;
      if (typeof projectId !== "string" || !Array.isArray(stories)) return null;
      if (stories.length === 0 || !stories.every(isGeneratedStory)) return null;

      return { projectId, stories };
    } catch (error) {
      reportFailure("load", error);
      return null;
    }
  },

  save: (owner: string, pending: PendingStories): void => {
    try {
      window.sessionStorage.setItem(keyFor(owner), JSON.stringify(pending));
    } catch (error) {
      reportFailure("save", error);
    }
  },

  clear: (owner: string): void => {
    try {
      window.sessionStorage.removeItem(keyFor(owner));
    } catch (error) {
      reportFailure("clear", error);
    }
  },
};
