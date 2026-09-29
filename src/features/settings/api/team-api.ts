import { baseApi } from "@/app/api/base-api";

import type { AddTeamMemberValues, TeamMember } from "@/features/settings/types";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // The API scopes this list to the caller's workspace from the token.
    getTeamMembers: builder.query<TeamMember[], void>({
      query: () => "/v1/users",
      providesTags: ["TeamMembers"],
    }),

    addTeamMember: builder.mutation<TeamMember, AddTeamMemberValues>({
      query: (values) => ({
        url: "/v1/users",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["TeamMembers"],
    }),
  }),
});

export const { useGetTeamMembersQuery, useAddTeamMemberMutation } = teamApi;
