import { baseApi } from "@/app/api/base-api";

interface UserProfile {
  email: string;
  displayName: string;
  role: "admin" | "viewer";
  avatar?: string;
  createdAt: string;
}

interface UpdateProfileRequest {
  displayName?: string;
  avatar?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UserPreferences {
  theme: "light" | "dark" | "auto";
  notifications: {
    email: boolean;
    push: boolean;
  };
  language: string;
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

    // Upload avatar
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: "/v1/users/me/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  useUploadAvatarMutation,
} = settingsApi;
