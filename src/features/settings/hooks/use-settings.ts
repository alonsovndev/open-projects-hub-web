import { useCallback } from "react";
import { message } from "antd";

import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} from "@/features/settings/api/settings-rtk-api";
import type { PasswordChangeData } from "@/features/settings/types";

export const useSettings = () => {
  // Profile
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetUserProfileQuery();

  // Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [changePasswordMutation, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const loading = profileLoading;
  const saving = isUpdatingProfile || isChangingPassword;
  const error = profileError;

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
    loading,
    error,
    saving,
    handleUpdateProfile,
    handleChangePassword,
  };
};
