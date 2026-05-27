import { baseApi } from "@/app/api/base-api";

import type { UserProfile, UserPreferences } from "@/features/settings/types";

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

    // Get user preferences
    getUserPreferences: builder.query<UserPreferences, void>({
      query: () => "/v1/users/me/preferences",
      providesTags: ["UserPreferences"],
    }),

    // Update user preferences
    updateUserPreferences: builder.mutation<UserPreferences, Partial<UserPreferences>>({
      query: (data) => ({
        url: "/v1/users/me/preferences",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["UserPreferences"],
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

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  useChangePasswordMutation,
} = settingsApi;
