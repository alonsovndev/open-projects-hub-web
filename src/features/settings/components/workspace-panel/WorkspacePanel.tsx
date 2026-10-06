import type { FC } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";

import { useWorkspace } from "@/features/settings/hooks/use-workspace";

import styles from "./workspace-panel.module.scss";

const { Text } = Typography;

export const WorkspacePanel: FC = () => {
  const [form] = Form.useForm();
  const { workspaceName, renaming, renameWorkspace } = useWorkspace();

  const handleFinish = async (values: { name: string }) => {
    await renameWorkspace(values.name);
  };

  return (
    <div className={styles.workspacePanel}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <ApartmentOutlined className={styles.icon} />
          <div>
            <Text className={styles.title}>Workspace</Text>
            <Text type="secondary" className={styles.subtitle}>
              The name your teammates see across the app
            </Text>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: workspaceName }}
          onFinish={handleFinish}
          className={styles.form}
        >
          <Form.Item
            label="Workspace Name"
            name="name"
            rules={[
              { required: true, message: "Please enter a workspace name" },
              { max: 100, message: "Keep it under 100 characters." },
            ]}
          >
            <Input size="large" placeholder="Enter a new name for your workspace" maxLength={100} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={renaming} size="large" block>
            Rename Workspace
          </Button>
        </Form>
      </Card>
    </div>
  );
};
