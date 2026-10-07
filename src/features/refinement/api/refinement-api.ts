import type {
  GenerateStoriesPayload,
  GenerateStoriesResponse,
  ApproveStoryPayload,
  ApproveStoriesBulkPayload,
  ApproveStoriesBulkResponse,
} from "@/features/refinement/types";
import { baseApi } from "@/app/api/base-api";

/**
 * Caches that go stale when a refined story is approved.
 *
 * Approval is the only path that writes a row into `stories`, so it changes the project
 * backlog, the story lists and the dashboard counts.
 */
const APPROVAL_SIDE_EFFECTS = [
  "Backlog",
  { type: "Stories", id: "LIST" },
  "DashboardStats",
] as const;

export const refinementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateStories: builder.mutation<GenerateStoriesResponse, GenerateStoriesPayload>({
      query: (body) => ({
        url: "/v1/refinement/generate-stories",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { provider }) => {
        const refreshCredits =
          (result !== undefined && (provider ?? "platform") === "platform") ||
          error?.status === 402;

        return refreshCredits ? ["CreditBalance"] : [];
      },
    }),

    approveStory: builder.mutation<{ id: string; title: string }, ApproveStoryPayload>({
      query: (body) => ({
        url: "/v1/refinement/approve-story",
        method: "POST",
        body,
      }),
      invalidatesTags: [...APPROVAL_SIDE_EFFECTS],
    }),

    approveStoriesBulk: builder.mutation<ApproveStoriesBulkResponse, ApproveStoriesBulkPayload>({
      query: (body) => ({
        url: "/v1/refinement/approve-stories",
        method: "POST",
        body,
      }),
      invalidatesTags: [...APPROVAL_SIDE_EFFECTS],
    }),
  }),
});

export const {
  useGenerateStoriesMutation,
  useApproveStoryMutation,
  useApproveStoriesBulkMutation,
} = refinementApi;
