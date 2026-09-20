import type { StoryStatus } from "@/features/backlog/types";

/**
 * Translates the API's story status into the one the UI renders.
 *
 * Shared by the story list and the backlog endpoints: both read the same column, and a map
 * that drifted between them would make the same story look different on two pages.
 */
const statusMap: Record<string, StoryStatus> = {
  todo: "backlog",
  in_progress: "in-progress",
  blocked: "review",
  done: "done",
};

export const mapStoryStatus = (apiStatus: string): StoryStatus => statusMap[apiStatus] ?? "backlog";
