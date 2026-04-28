import type { FC } from "react";
import { Form, Input, Button, Card, Avatar, Upload, Typography } from "antd";
import { UserOutlined, CameraOutlined } from "@ant-design/icons";

import type { UserProfile } from "@/features/settings/types";

import styles from "./profile-form.module.scss";

const { TextArea } = Input;
const { Text } = Typography;

interface ProfileFormProps {
  profile: UserProfile;
  saving: boolean;
  onSubmit: (values: Partial<UserProfile>) => Promise<void>;
}

export const ProfileForm: FC<ProfileFormProps> = ({ profile, saving, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: Partial<UserProfile>) => {
    await onSubmit(values);
  };

  return (
    <Card className={styles.card}>
      <div className={styles.avatarSection}>
        <Avatar size={100} icon={<UserOutlined />} className={styles.avatar}>
          {profile.displayName[0].toUpperCase()}
        </Avatar>
        <Upload showUploadList={false}>
          <Button icon={<CameraOutlined />} className={styles.uploadButton}>
            Change Photo
          </Button>
        </Upload>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={profile}
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

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input size="large" placeholder="your.email@example.com" />
        </Form.Item>

        <Form.Item label="Phone" name="phone">
          <Input size="large" placeholder="+1 (555) 123-4567" />
        </Form.Item>

        <Form.Item label="Location" name="location">
          <Input size="large" placeholder="City, State/Country" />
        </Form.Item>

        <Form.Item label="Bio" name="bio">
          <TextArea rows={4} placeholder="Tell us about yourself..." maxLength={500} showCount />
        </Form.Item>

        <div className={styles.footer}>
          <Text type="secondary" className={styles.roleText}>
            Role: {profile.role}
          </Text>
          <Button type="primary" htmlType="submit" loading={saving} size="large">
            Save Changes
          </Button>
        </div>
      </Form>
    </Card>
  );
};
