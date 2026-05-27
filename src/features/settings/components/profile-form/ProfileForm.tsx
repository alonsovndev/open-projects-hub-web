import type { FC } from "react";
import { Form, Input, Button, Card, Typography, Descriptions } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

import type { UserProfile } from "@/features/settings/types";

import styles from "./profile-form.module.scss";

const { Text } = Typography;

interface ProfileFormProps {
  profile: UserProfile;
  saving: boolean;
  onSubmit: (values: { displayName: string }) => Promise<void>;
}

export const ProfileForm: FC<ProfileFormProps> = ({ profile, saving, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: { displayName: string }) => {
    await onSubmit(values);
  };

  return (
    <div className={styles.profileForm}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <UserOutlined className={styles.icon} />
          <div>
            <Text className={styles.title}>Profile Information</Text>
            <Text type="secondary" className={styles.subtitle}>
              Manage your personal information
            </Text>
          </div>
        </div>

        <Descriptions column={1} className={styles.readonlyFields} colon={false}>
          <Descriptions.Item
            label={
              <>
                <MailOutlined /> Email
              </>
            }
          >
            {profile.email}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <UserOutlined /> Role
              </>
            }
          >
            <Text code>{profile.role}</Text>
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.divider} />

        <Form
          form={form}
          layout="vertical"
          initialValues={{ displayName: profile.displayName }}
          onFinish={handleFinish}
          className={styles.form}
        >
          <Form.Item
            label="Display Name"
            name="displayName"
            rules={[{ required: true, message: "Please enter your display name" }]}
          >
            <Input size="large" placeholder="Enter your name" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving} size="large" block>
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
};
