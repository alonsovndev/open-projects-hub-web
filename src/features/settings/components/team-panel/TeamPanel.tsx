import type { FC } from "react";
import { Alert, Button, Card, Form, Input, Select, Table, Tag, Typography } from "antd";
import { TeamOutlined } from "@ant-design/icons";

import { useTeam } from "@/features/settings/hooks/use-team";
import type { AddTeamMemberValues, TeamMember } from "@/features/settings/types";

import styles from "./team-panel.module.scss";

const { Text } = Typography;

const ROLE_OPTIONS = [
  { value: "member", label: "Member — manages clients, projects and stories" },
  { value: "viewer", label: "Viewer — read-only access" },
];

const ROLE_COLORS: Record<TeamMember["role"], string> = {
  admin: "blue",
  member: "green",
  viewer: "default",
};

const columns = [
  { title: "Name", dataIndex: "displayName", key: "displayName" },
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role: TeamMember["role"]) => <Tag color={ROLE_COLORS[role]}>{role}</Tag>,
  },
];

export const TeamPanel: FC = () => {
  const [form] = Form.useForm<AddTeamMemberValues>();
  const { members, isLoading, isError, adding, addTeamMember } = useTeam();

  const handleFinish = async (values: AddTeamMemberValues) => {
    if (await addTeamMember(values)) {
      form.resetFields();
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <TeamOutlined className={styles.icon} />
        <div>
          <Text className={styles.title}>Team</Text>
          <Text type="secondary" className={styles.subtitle}>
            People in your workspace. Members work on your clients and projects; viewers can only
            read them.
          </Text>
        </div>
      </div>

      {isError ? (
        <Alert type="error" showIcon message="Unable to load your team. Please try again." />
      ) : (
        <Table<TeamMember>
          rowKey="id"
          columns={columns}
          dataSource={members}
          loading={isLoading}
          pagination={false}
          size="middle"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ role: "member" }}
        className={`${styles.form} ${styles.section}`}
      >
        <Text className={styles.title}>Add someone</Text>
        <div className={styles.formRow}>
          <Form.Item
            label="Full name"
            name="displayName"
            rules={[
              { required: true, message: "Please enter their name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input size="large" placeholder="Alex Doe" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter their email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input size="large" placeholder="alex@example.com" autoComplete="off" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select size="large" options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item
            label="Temporary password"
            name="password"
            extra="Share it with them privately; they can change it in Settings → Security."
            rules={[
              { required: true, message: "Please set a temporary password" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                message: "Use at least one letter and one number",
              },
            ]}
          >
            <Input.Password size="large" autoComplete="new-password" />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" loading={adding} size="large">
          Add to workspace
        </Button>
      </Form>
    </Card>
  );
};
