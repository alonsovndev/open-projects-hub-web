import { useCallback } from "react";
import { message } from "antd";

import { getErrorMessage } from "@/shared/types/api";
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
        message.success("Profile updated.");
      } catch (err) {
        message.error(getErrorMessage(err, "We couldn't update your profile. Please try again."));
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
        message.success("Password changed.");
      } catch (err) {
        const errorMessage = getErrorMessage(
          err,
          "We couldn't change your password. Please try again."
        );
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
