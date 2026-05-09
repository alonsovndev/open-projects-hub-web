import { baseApi } from "@/app/api/base-api";
import type { Story, StoryStatus, BacklogFilters } from "@/features/backlog/types";

interface GetStoriesResponse {
  stories: Story[];
  total: number;
}

interface CreateStoryRequest {
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: "high" | "medium" | "low";
  projectId: string;
  storyPoints?: number;
  assignee?: string;
}

interface UpdateStoryRequest {
  id: string;
  data: Partial<Omit<Story, "id" | "createdAt" | "updatedAt">>;
}

interface MoveStoryRequest {
  id: string;
  status: StoryStatus;
}

export const storiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all stories with optional filters
    getStories: builder.query<GetStoriesResponse, Partial<BacklogFilters> & { projectId?: string }>(
      {
        query: (filters) => ({
          url: "/stories",
          params: filters,
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
        url: "/stories/backlog",
        params: projectId ? { projectId } : undefined,
      }),
      providesTags: ["Backlog"],
    }),

    // Get single story by ID
    getStoryById: builder.query<Story, string>({
      query: (id) => `/stories/${id}`,
      providesTags: (result, error, id) => [{ type: "Stories", id }],
    }),

    // Create new story
    createStory: builder.mutation<Story, CreateStoryRequest>({
      query: (story) => ({
        url: "/stories",
        method: "POST",
        body: story,
      }),
      invalidatesTags: [{ type: "Stories", id: "LIST" }, "Backlog", "DashboardStats"],
    }),

    // Update story
    updateStory: builder.mutation<Story, UpdateStoryRequest>({
      query: ({ id, data }) => ({
        url: `/stories/${id}`,
        method: "PATCH",
        body: data,
      }),
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
        url: `/stories/${id}/move`,
        method: "PATCH",
        body: { status },
      }),
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
    deleteStory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/stories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Stories", id },
        { type: "Stories", id: "LIST" },
        "Backlog",
        "DashboardStats",
      ],
    }),

    // Export stories (CSV/Excel)
    exportStories: builder.mutation<Blob, { projectId?: string; format: "csv" | "excel" }>({
      query: ({ projectId, format }) => ({
        url: "/stories/export",
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
