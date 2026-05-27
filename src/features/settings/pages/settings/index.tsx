import type { FC } from "react";
import { Tabs, Typography, Spin, Alert } from "antd";
import { UserOutlined, LockOutlined, SettingOutlined } from "@ant-design/icons";

import { useSettings } from "@/features/settings/hooks/use-settings";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { PreferencesForm } from "@/features/settings/components/preferences-form";
import { PasswordForm } from "@/features/settings/components/password-form";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./settings.module.scss";

const { Title } = Typography;

export const SettingsPage: FC = () => {
  usePageTitle("Settings");
  const {
    profile,
    preferences,
    loading,
    error,
    saving,
    handleUpdateProfile,
    handleUpdatePreferences,
    handleChangePassword,
  } = useSettings();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading settings..." />
      </div>
    );
  }

  if (error || !profile || !preferences) {
    return (
      <div className={styles.pageContainer}>
        <Alert
          message="Error Loading Settings"
          description="Failed to load your profile. Please try again."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const tabItems = [
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined />
          Profile
        </span>
      ),
      children: <ProfileForm profile={profile} saving={saving} onSubmit={handleUpdateProfile} />,
    },
    {
      key: "preferences",
      label: (
        <span>
          <SettingOutlined />
          Preferences
        </span>
      ),
      children: (
        <PreferencesForm
          preferences={preferences}
          saving={saving}
          onSubmit={handleUpdatePreferences}
        />
      ),
    },
    {
      key: "security",
      label: (
        <span>
          <LockOutlined />
          Security
        </span>
      ),
      children: <PasswordForm saving={saving} onSubmit={handleChangePassword} />,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Title level={1} className={styles.pageTitle}>
          Settings
        </Title>
      </div>

      <Tabs items={tabItems} defaultActiveKey="profile" className={styles.tabs} />
    </div>
  );
};
export default SettingsPage;
