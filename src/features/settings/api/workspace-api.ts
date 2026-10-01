import { baseApi } from "@/app/api/base-api";

import type { WorkspaceSummary } from "@/features/auth/types";

interface UpdateWorkspaceNameRequest {
  name: string;
}

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Renaming is the workspace Admin's alone (require_admin); the current
    // name lives on the auth session, so there is no GET endpoint here.
    updateWorkspaceName: builder.mutation<WorkspaceSummary, UpdateWorkspaceNameRequest>({
      query: (data) => ({
        url: "/v1/workspaces/me",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateWorkspaceNameMutation } = workspaceApi;
