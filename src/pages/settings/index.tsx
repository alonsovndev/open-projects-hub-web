import type { FC } from "react";
import { Tabs, Typography, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { useSettings } from "@/features/settings/hooks/use-settings";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { PasswordForm } from "@/features/settings/components/password-form";

import styles from "./settings.module.scss";

const { Title } = Typography;

export const SettingsPage: FC = () => {
  const { profile, loading, saving, handleUpdateProfile, handleChangePassword } = useSettings();

  if (loading || !profile) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
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
