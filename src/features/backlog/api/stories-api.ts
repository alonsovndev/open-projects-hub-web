import { baseApi } from "@/app/api/base-api";
import { mapStoryStatus } from "@/features/backlog/api/map-story-status";
import type { Story, BacklogFilters } from "@/features/backlog/types";

// Backend API response types
interface StoryResponse {
  id: string;
  title: string;
  description: string | null;
  acceptanceCriteria: string[];
  projectId: string;
  createdBy: string;
  assignedTo: string | null;
  status: string;
  priority: string;
  points: number | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedStoriesResponse {
  items: StoryResponse[];
  total: number;
  page: number;
  per_page: number;
}

interface GetStoriesResponse {
  stories: Story[];
  total: number;
}

// Transform backend story to frontend format
const transformStory = (backendStory: StoryResponse): Story => ({
  id: backendStory.id,
  title: backendStory.title,
  description: backendStory.description ?? "",
  acceptanceCriteria: backendStory.acceptanceCriteria ?? [],
  status: mapStoryStatus(backendStory.status),
  priority: backendStory.priority as Story["priority"],
  storyPoints: backendStory.points ?? undefined,
  assignee: backendStory.assignedTo ?? undefined,
  projectId: backendStory.projectId,
  createdAt: backendStory.createdAt,
  updatedAt: backendStory.updatedAt,
});

export const storiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all stories with optional filters
    getStories: builder.query<GetStoriesResponse, Partial<BacklogFilters> & { projectId?: string }>(
      {
        query: (filters) => ({
          url: "/v1/stories",
          params: {
            project_id: filters.projectId,
            priority: filters.priority !== "all" ? filters.priority : undefined,
            // The API defaults to 20; ask for its maximum since this list is filtered client-side.
            limit: 100,
          },
        }),
        transformResponse: (response: PaginatedStoriesResponse) => ({
          stories: response.items.map(transformStory),
          total: response.total,
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.stories.map(({ id }) => ({ type: "Stories" as const, id })),
                { type: "Stories", id: "LIST" },
              ]
            : [{ type: "Stories", id: "LIST" }],
      }
    ),

    // Delete story
    deleteStory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/stories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stories", id },
        { type: "Stories", id: "LIST" },
        "Backlog",
        "DashboardStats",
      ],
    }),
  }),
});

export const { useGetStoriesQuery, useDeleteStoryMutation } = storiesApi;
