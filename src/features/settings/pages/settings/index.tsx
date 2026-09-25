import type { FC } from "react";
import { Tabs, Typography, Spin, Alert } from "antd";
import { UserOutlined, LockOutlined, RobotOutlined } from "@ant-design/icons";

import { useSettings } from "@/features/settings/hooks/use-settings";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { PasswordForm } from "@/features/settings/components/password-form";
import { AiProvidersPanel } from "@/features/settings/components/ai-providers";
import { useRole } from "@/features/auth/hooks/use-role";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./settings.module.scss";

const { Title } = Typography;

export const SettingsPage: FC = () => {
  usePageTitle("Settings");
  const { profile, loading, error, saving, handleUpdateProfile, handleChangePassword } =
    useSettings();
  // Refinement — and therefore credits and provider keys — is admin-only, and the
  // backend guards these endpoints with require_admin. Rendering the tab for a Viewer
  // would only produce 403s.
  const { isAdmin } = useRole();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading settings..." />
      </div>
    );
  }

  if (error || !profile) {
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
      key: "security",
      label: (
        <span>
          <LockOutlined />
          Security
        </span>
      ),
      children: <PasswordForm saving={saving} onSubmit={handleChangePassword} />,
    },
    ...(isAdmin
      ? [
          {
            key: "ai-providers",
            label: (
              <span>
                <RobotOutlined />
                AI Providers
              </span>
            ),
            children: <AiProvidersPanel />,
          },
        ]
      : []),
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
