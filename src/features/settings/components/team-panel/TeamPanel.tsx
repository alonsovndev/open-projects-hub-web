import type { FC } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Switch,
  Table,
  Tag,
  Typography,
  type TableColumnsType,
} from "antd";
import { DeleteOutlined, TeamOutlined } from "@ant-design/icons";

import { useTeam } from "@/features/settings/hooks/use-team";
import type { AddTeamMemberValues, TeamMember } from "@/features/settings/types";

import styles from "./team-panel.module.scss";

const { Text } = Typography;

// Mirrors the API's workspace_limits.max_users; the API enforces it and rejects the extra add.
const MAX_WORKSPACE_USERS = 5;

const ROLE_COLORS: Record<TeamMember["role"], string> = {
  admin: "blue",
  member: "green",
};

export const TeamPanel: FC = () => {
  const [form] = Form.useForm<AddTeamMemberValues>();
  const {
    members,
    isLoading,
    isError,
    adding,
    addTeamMember,
    setMemberActive,
    togglingStatusMemberId,
    removeMember,
    removingMemberId,
  } = useTeam();

  const columns: TableColumnsType<TeamMember> = [
    { title: "Name", dataIndex: "displayName", key: "displayName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: TeamMember["role"]) => <Tag color={ROLE_COLORS[role]}>{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, member) =>
        member.role === "admin" ? (
          <Tag color="blue">active</Tag>
        ) : (
          <Switch
            size="small"
            checked={isActive}
            loading={togglingStatusMemberId === member.id}
            aria-label={`Active: ${member.displayName}`}
            onChange={(active) => setMemberActive(member, active)}
          />
        ),
    },
    {
      title: "",
      key: "actions",
      width: 64,
      render: (_, member) =>
        member.role === "admin" ? null : (
          <Popconfirm
            title={`Delete ${member.displayName} permanently?`}
            description="Everything they created or were assigned moves to you. This can't be undone. To keep their account, switch them to inactive instead."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => removeMember(member)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              loading={removingMemberId === member.id}
              aria-label={`Delete ${member.displayName}`}
            />
          </Popconfirm>
        ),
    },
  ];

  const atUserLimit = members.length >= MAX_WORKSPACE_USERS;

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
            People in your workspace. Members work on your clients and projects alongside you.
            Your clients don't need an account: share a project's access code with them instead.
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
        className={`${styles.form} ${styles.section}`}
      >
        <Text className={styles.title}>Add someone</Text>
        <Text type="secondary">
          We email them a link, valid for 24 hours, to verify their address and choose their own
          password. They get free AI credits once they verify.
        </Text>
        <Text type={atUserLimit ? "danger" : "secondary"}>
          {members.length} of {MAX_WORKSPACE_USERS} users in this workspace.
          {atUserLimit ? " Remove someone to add another." : ""}
        </Text>
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
        </div>
        <Button
          type="primary"
          htmlType="submit"
          loading={adding}
          disabled={atUserLimit}
          size="large"
        >
          Add to workspace
        </Button>
      </Form>
    </Card>
  );
};
