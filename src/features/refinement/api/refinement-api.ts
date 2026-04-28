import type { StoryDraft, AISuggestion } from "@/features/refinement/types";

// Mock data for development
export const getMockStoryDrafts = (): StoryDraft[] => [
  {
    id: "story-1",
    title: "User Login Feature",
    description: "Users should be able to log in",
    acceptanceCriteria: ["User can enter email and password", "System validates credentials"],
    status: "draft",
    projectId: "PROJ-2024",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getMockAISuggestions = (): AISuggestion[] => [
  {
    id: "suggestion-1",
    type: "title",
    content: "User Authentication - Login with Email and Password",
    reasoning: "More descriptive and follows standard naming conventions",
    confidence: 0.92,
  },
  {
    id: "suggestion-2",
    type: "description",
    content:
      "As a registered user, I want to log in to the application using my email and password so that I can access my personalized dashboard and account features.",
    reasoning: "Follows user story format with clear role, action, and benefit",
    confidence: 0.88,
  },
  {
    id: "suggestion-3",
    type: "criteria",
    content:
      "Given I am on the login page\nWhen I enter a valid email and password\nThen I should be redirected to my dashboard",
    reasoning: "Uses Given-When-Then format for clarity",
    confidence: 0.9,
  },
];

export const refineStory = async (storyId: string, prompt: string): Promise<AISuggestion[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return getMockAISuggestions();
};

export const saveStoryDraft = async (draft: Partial<StoryDraft>): Promise<StoryDraft> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: draft.id || `story-${Date.now()}`,
    title: draft.title || "",
    description: draft.description || "",
    acceptanceCriteria: draft.acceptanceCriteria || [],
    status: "draft",
    projectId: draft.projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
