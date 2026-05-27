import type { FC } from "react";
import { Form, Select, Button, Card, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import type { UserPreferences } from "@/features/settings/types";

import styles from "./preferences-form.module.scss";

const { Text } = Typography;

interface PreferencesFormProps {
  preferences: UserPreferences;
  saving: boolean;
  onSubmit: (values: Partial<UserPreferences>) => Promise<void>;
}

export const PreferencesForm: FC<PreferencesFormProps> = ({ preferences, saving, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values: Partial<UserPreferences>) => {
    await onSubmit(values);
  };

  return (
    <div className={styles.preferencesForm}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <SettingOutlined className={styles.icon} />
          <div>
            <Text className={styles.title}>Preferences</Text>
            <Text type="secondary" className={styles.subtitle}>
              Customize your application experience
            </Text>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            theme: preferences.theme,
            language: preferences.language,
          }}
          onFinish={handleFinish}
          className={styles.form}
        >
          <Form.Item label="Theme" name="theme">
            <Select size="large">
              <Select.Option value="light">Light</Select.Option>
              <Select.Option value="dark">Dark</Select.Option>
              <Select.Option value="auto">System</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Language" name="language">
            <Select size="large">
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="es">Español</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving} size="large" block>
            Save Preferences
          </Button>
        </Form>
      </Card>
    </div>
  );
};
