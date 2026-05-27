import { baseApi } from "@/app/api/base-api";
import type { Story, StoryStatus, BacklogFilters } from "@/features/backlog/types";

// Backend API response types
interface StoryResponse {
  id: string;
  title: string;
  description: string | null;
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

// Map backend status to frontend status
const mapStatus = (backendStatus: string): StoryStatus => {
  const statusMap: Record<string, StoryStatus> = {
    todo: "backlog",
    in_progress: "in-progress",
    done: "done",
  };
  return (statusMap[backendStatus] || "backlog") as StoryStatus;
};

// Transform backend story to frontend format
const transformStory = (backendStory: StoryResponse): Story => ({
  id: backendStory.id,
  title: backendStory.title,
  description: backendStory.description ?? "",
  acceptanceCriteria: [], // Backend doesn't have this
  status: mapStatus(backendStory.status),
  priority: backendStory.priority as Story["priority"],
  storyPoints: backendStory.points ?? undefined,
  assignee: backendStory.assignedTo ?? undefined,
  projectId: backendStory.projectId,
  createdAt: backendStory.createdAt,
  updatedAt: backendStory.updatedAt,
});

export const storiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get stories by project ID with pagination
    getStoriesByProject: builder.query<
      GetStoriesResponse,
      { projectId: string; limit?: number; offset?: number }
    >({
      query: ({ projectId, limit = 50, offset = 0 }) => ({
        url: `/v1/stories/by-project/${projectId}`,
        params: { limit, offset },
      }),
      transformResponse: (response: PaginatedStoriesResponse) => ({
        stories: response.items.map(transformStory),
        total: response.total,
      }),
      providesTags: (result, error, { projectId }) =>
        result
          ? [
              ...result.stories.map(({ id }) => ({ type: "Stories" as const, id })),
              { type: "Stories", id: `PROJECT-${projectId}` },
            ]
          : [{ type: "Stories", id: `PROJECT-${projectId}` }],
    }),

    // Get all stories with optional filters
    getStories: builder.query<GetStoriesResponse, Partial<BacklogFilters> & { projectId?: string }>(
      {
        query: (filters) => ({
          url: "/v1/stories",
          params: {
            project_id: filters.projectId,
            priority: filters.priority !== "all" ? filters.priority : undefined,
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

    // Export stories (CSV/Markdown)
    exportStories: builder.mutation<Blob, { projectId?: string; format: "csv" | "markdown" }>({
      query: ({ projectId, format }) => ({
        url: "/v1/stories/export",
        method: "POST",
        params: { projectId, format },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useGetStoriesByProjectQuery, useGetStoriesQuery, useDeleteStoryMutation } =
  storiesApi;
