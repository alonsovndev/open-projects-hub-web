import type {
  UpdateDraftPayload,
  GenerateStoriesPayload,
  GenerateStoriesResponse,
  ApproveDraftsBulkPayload,
  ApproveDraftsBulkResponse,
} from "@/features/refinement/types";
import { baseApi } from "@/app/api/base-api";

/**
 * Caches that go stale when a draft is approved.
 *
 * Approval is the only path that writes a row into `stories`, so it changes the project
 * backlog, the story lists and the dashboard counts — not just the draft list it came from.
 */
const APPROVAL_SIDE_EFFECTS = [
  "Backlog",
  { type: "Stories", id: "LIST" },
  "DashboardStats",
] as const;

export const refinementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateDraft: builder.mutation<{ id: string }, { id: string; data: UpdateDraftPayload }>({
      query: ({ id, data }) => ({
        url: `/v1/refinement/drafts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Refinement", id },
        { type: "Refinement", id: "LIST" },
      ],
    }),

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

        return [
          { type: "Refinement", id: "LIST" },
          ...(refreshCredits ? (["CreditBalance"] as const) : []),
        ];
      },
    }),

    deleteDraft: builder.mutation<void, string>({
      query: (draftId) => ({
        url: `/v1/refinement/drafts/${draftId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, draftId) => [
        { type: "Refinement", id: draftId },
        { type: "Refinement", id: "LIST" },
      ],
    }),

    approveDraft: builder.mutation<{ id: string; title: string }, string>({
      query: (draftId) => ({
        url: `/v1/refinement/drafts/${draftId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (result, error, draftId) => [
        { type: "Refinement", id: draftId },
        { type: "Refinement", id: "LIST" },
        ...APPROVAL_SIDE_EFFECTS,
      ],
    }),

    approveDraftsBulk: builder.mutation<ApproveDraftsBulkResponse, ApproveDraftsBulkPayload>({
      query: (body) => ({
        url: "/v1/refinement/approve-drafts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Refinement", id: "LIST" }, ...APPROVAL_SIDE_EFFECTS],
    }),
  }),
});

export const {
  useUpdateDraftMutation,
  useGenerateStoriesMutation,
  useDeleteDraftMutation,
  useApproveDraftMutation,
  useApproveDraftsBulkMutation,
} = refinementApi;
