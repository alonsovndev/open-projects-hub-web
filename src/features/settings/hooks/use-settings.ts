import { useCallback } from "react";
import { message } from "antd";

import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  useChangePasswordMutation,
} from "@/features/settings/api/settings-rtk-api";
import type { PasswordChangeData, UserPreferences } from "@/features/settings/types";

export const useSettings = () => {
  // Profile
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetUserProfileQuery();

  // Preferences
  const {
    data: preferences,
    isLoading: preferencesLoading,
    error: preferencesError,
  } = useGetUserPreferencesQuery();

  // Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updatePreferences, { isLoading: isUpdatingPreferences }] =
    useUpdateUserPreferencesMutation();
  const [changePasswordMutation, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const loading = profileLoading || preferencesLoading;
  const saving = isUpdatingProfile || isUpdatingPreferences || isChangingPassword;
  const error = profileError || preferencesError;

  const handleUpdateProfile = useCallback(
    async (values: { displayName: string }) => {
      try {
        await updateProfile({ displayName: values.displayName }).unwrap();
        message.success("Profile updated successfully");
      } catch (err) {
        console.error("Failed to update profile:", err);
        message.error("Failed to update profile. Please try again.");
        throw err;
      }
    },
    [updateProfile]
  );

  const handleUpdatePreferences = useCallback(
    async (values: Partial<UserPreferences>) => {
      try {
        await updatePreferences(values).unwrap();
        message.success("Preferences updated successfully");
      } catch (err) {
        console.error("Failed to update preferences:", err);
        message.error("Failed to update preferences. Please try again.");
        throw err;
      }
    },
    [updatePreferences]
  );

  const handleChangePassword = useCallback(
    async (data: PasswordChangeData) => {
      try {
        await changePasswordMutation({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }).unwrap();
        message.success("Password changed successfully");
      } catch (err) {
        console.error("Failed to change password:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to change password. Please try again.";
        message.error(errorMessage);
        throw err;
      }
    },
    [changePasswordMutation]
  );

  return {
    profile: profile ?? null,
    preferences: preferences ?? null,
    loading,
    error,
    saving,
    handleUpdateProfile,
    handleUpdatePreferences,
    handleChangePassword,
  };
};
