import { useState, useEffect } from "react";
import { message } from "antd";

import type { UserProfile, PasswordChangeData } from "@/features/settings/types";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "@/features/settings/api/settings-api";

export const useSettings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const profileData = await getUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to load settings:", error);
      message.error("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setSaving(true);
      const updated = await updateUserProfile(updates);
      setProfile(updated);
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (data: PasswordChangeData) => {
    try {
      setSaving(true);
      await changePassword(data);
      message.success("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password. Please try again.";
      message.error(errorMessage);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    handleUpdateProfile,
    handleChangePassword,
  };
};
