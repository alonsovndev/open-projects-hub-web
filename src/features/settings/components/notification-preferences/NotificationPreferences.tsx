import type { FC } from "react";
import { Card, Switch, Typography, Divider } from "antd";
import {
  BellOutlined,
  MailOutlined,
  ProjectOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

import type { NotificationPreferences } from "@/features/settings/types";

import styles from "./notification-preferences.module.scss";

const { Text } = Typography;

interface NotificationPreferencesProps {
  preferences: NotificationPreferences;
  saving: boolean;
  onChange: (key: keyof NotificationPreferences, value: boolean) => void;
}

export const NotificationPreferencesCard: FC<NotificationPreferencesProps> = ({
  preferences,
  saving,
  onChange,
}) => {
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <BellOutlined className={styles.icon} />
        <div>
          <Text className={styles.title}>Notifications</Text>
          <Text type="secondary" className={styles.subtitle}>
            Manage how you receive updates
          </Text>
        </div>
      </div>

      <div className={styles.preferences}>
        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <MailOutlined className={styles.itemIcon} />
            <div>
              <Text className={styles.itemTitle}>Email Notifications</Text>
              <Text type="secondary" className={styles.itemDescription}>
                Receive email updates about your activity
              </Text>
            </div>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onChange={(checked) => onChange("emailNotifications", checked)}
            disabled={saving}
          />
        </div>

        <Divider className={styles.divider} />

        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <ProjectOutlined className={styles.itemIcon} />
            <div>
              <Text className={styles.itemTitle}>Project Updates</Text>
              <Text type="secondary" className={styles.itemDescription}>
                Get notified when projects you follow are updated
              </Text>
            </div>
          </div>
          <Switch
            checked={preferences.projectUpdates}
            onChange={(checked) => onChange("projectUpdates", checked)}
            disabled={saving}
          />
        </div>

        <Divider className={styles.divider} />

        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <TeamOutlined className={styles.itemIcon} />
            <div>
              <Text className={styles.itemTitle}>Team Mentions</Text>
              <Text type="secondary" className={styles.itemDescription}>
                Get notified when someone mentions you
              </Text>
            </div>
          </div>
          <Switch
            checked={preferences.teamMentions}
            onChange={(checked) => onChange("teamMentions", checked)}
            disabled={saving}
          />
        </div>

        <Divider className={styles.divider} />

        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <CalendarOutlined className={styles.itemIcon} />
            <div>
              <Text className={styles.itemTitle}>Weekly Digest</Text>
              <Text type="secondary" className={styles.itemDescription}>
                Receive a weekly summary of your activity
              </Text>
            </div>
          </div>
          <Switch
            checked={preferences.weeklyDigest}
            onChange={(checked) => onChange("weeklyDigest", checked)}
            disabled={saving}
          />
        </div>
      </div>
    </Card>
  );
};
