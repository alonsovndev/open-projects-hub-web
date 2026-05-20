import { baseApi } from "@/app/api/base-api";
import type { Story, StoryStatus, BacklogFilters } from "@/features/backlog/types";

// Backend API response types
interface StoryResponse {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  created_by: string;
  assigned_to: string | null;
  status: string;
  priority: string;
  points: number | null;
  created_at: string;
  updated_at: string;
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

interface CreateStoryRequest {
  title: string;
  description?: string;
  project_id: string;
  priority?: "high" | "medium" | "low";
  points?: number;
}

interface UpdateStoryRequest {
  id: string;
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    points?: number;
  };
}

interface MoveStoryRequest {
  id: string;
  status: StoryStatus;
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
  assignee: backendStory.assigned_to ?? undefined,
  projectId: backendStory.project_id,
  projectName: "Project", // Will need to fetch separately
  createdAt: backendStory.created_at,
  updatedAt: backendStory.updated_at,
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
            status: filters.priority !== "all" ? undefined : undefined,
            priority: filters.priority !== "all" ? filters.priority : undefined,
            assigned_to: filters.assignee,
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

    // Get stories grouped by status (for backlog board)
    getBacklogStories: builder.query<GetStoriesResponse, { projectId?: string }>({
      query: ({ projectId }) => ({
        url: projectId ? `/v1/stories/by-project/${projectId}` : "/v1/stories",
      }),
      transformResponse: (response: PaginatedStoriesResponse) => ({
        stories: response.items.map(transformStory),
        total: response.total,
      }),
      providesTags: ["Backlog"],
    }),

    // Get single story by ID
    getStoryById: builder.query<Story, string>({
      query: (id) => `/v1/stories/${id}`,
      transformResponse: (response: StoryResponse) => transformStory(response),
      providesTags: (result, error, id) => [{ type: "Stories", id }],
    }),

    // Create new story
    createStory: builder.mutation<Story, CreateStoryRequest>({
      query: (story) => ({
        url: "/v1/stories",
        method: "POST",
        body: story,
      }),
      transformResponse: (response: StoryResponse) => transformStory(response),
      invalidatesTags: [{ type: "Stories", id: "LIST" }, "Backlog", "DashboardStats"],
    }),

    // Update story
    updateStory: builder.mutation<Story, UpdateStoryRequest>({
      query: ({ id, data }) => ({
        url: `/v1/stories/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: StoryResponse) => transformStory(response),
      invalidatesTags: (result, error, { id }) => [
        { type: "Stories", id },
        { type: "Stories", id: "LIST" },
        "Backlog",
        "DashboardStats",
      ],
    }),

    // Move story to different status (drag-and-drop)
    moveStory: builder.mutation<Story, MoveStoryRequest>({
      query: ({ id, status }) => ({
        url: `/v1/stories/${id}`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: StoryResponse) => transformStory(response),
      // Optimistic update for smooth UX
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          storiesApi.util.updateQueryData("getBacklogStories", {}, (draft) => {
            const story = draft.stories.find((s) => s.id === id);
            if (story) {
              story.status = status;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Stories", id },
        "Backlog",
        "DashboardStats",
      ],
    }),

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

export const {
  useGetStoriesQuery,
  useGetBacklogStoriesQuery,
  useGetStoryByIdQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useMoveStoryMutation,
  useDeleteStoryMutation,
  useExportStoriesMutation,
} = storiesApi;
