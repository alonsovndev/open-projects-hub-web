import { baseApi } from "@/app/api/base-api";

import type { UserProfile } from "@/features/settings/types";

interface UpdateProfileRequest {
  displayName: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "/v1/users/me/profile",
      providesTags: ["UserProfile"],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: "/v1/users/me/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    // Change password
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (data) => ({
        url: "/v1/users/me/password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useChangePasswordMutation } =
  settingsApi;
