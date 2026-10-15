import { isDev } from "@/config/env";
import type { GeneratedStory } from "@/features/refinement/types";
import { z } from "zod";
import { generatedStorySchema } from "./story-schema";

const KEY_PREFIX = "open-projects-hub.refinement-pending";

export interface PendingStories {
  /** The project the stories were generated for; approval must target it. */
  projectId: string;
  stories: GeneratedStory[];
}

// Keyed by account so a second sign-in in the same tab never sees another user's stories.
const keyFor = (owner: string) => `${KEY_PREFIX}.${owner}`;

const pendingStoriesSchema = z.object({
  projectId: z.string().min(1),
  stories: z.array(generatedStorySchema).min(1),
});

const reportFailure = (action: "load" | "save" | "clear") => {
  if (isDev) {
    console.error(`Failed to ${action} pending refinement stories.`);
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

      const parsed = pendingStoriesSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : null;
    } catch {
      reportFailure("load");
      return null;
    }
  },

  save: (owner: string, pending: PendingStories): void => {
    try {
      window.sessionStorage.setItem(
        keyFor(owner),
        JSON.stringify(pendingStoriesSchema.parse(pending))
      );
    } catch {
      reportFailure("save");
    }
  },

  clear: (owner: string): void => {
    try {
      window.sessionStorage.removeItem(keyFor(owner));
    } catch {
      reportFailure("clear");
    }
  },
};
