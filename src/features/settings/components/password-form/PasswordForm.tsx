import type { FC } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

import type { PasswordChangeData } from "@/features/settings/types";

import styles from "./password-form.module.scss";

const { Text } = Typography;

interface PasswordFormProps {
  saving: boolean;
  onSubmit: (data: PasswordChangeData) => Promise<void>;
}

export const PasswordForm: FC<PasswordFormProps> = ({ saving, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: PasswordChangeData) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch {
      // Error already handled in hook
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <LockOutlined className={styles.icon} />
        <div>
          <Text className={styles.title}>Change Password</Text>
          <Text type="secondary" className={styles.subtitle}>
            Update your password to keep your account secure
          </Text>
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish} className={styles.form}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter your current password" }]}
        >
          <Input.Password size="large" placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password size="large" placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Confirm new password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={saving} size="large" block>
          Change Password
        </Button>
      </Form>
    </Card>
  );
};
