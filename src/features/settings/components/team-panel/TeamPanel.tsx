import type { FC } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
  Typography,
  type TableColumnsType,
} from "antd";
import { DeleteOutlined, TeamOutlined } from "@ant-design/icons";

import { useTeam } from "@/features/settings/hooks/use-team";
import type { AddTeamMemberValues, AssignableRole, TeamMember } from "@/features/settings/types";

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

const ROLE_CHANGE_OPTIONS = [
  { value: "member", label: "member" },
  { value: "viewer", label: "viewer" },
];

export const TeamPanel: FC = () => {
  const [form] = Form.useForm<AddTeamMemberValues>();
  const {
    members,
    isLoading,
    isError,
    adding,
    addTeamMember,
    changeRole,
    updatingRoleMemberId,
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
      render: (role: TeamMember["role"], member) =>
        role === "admin" ? (
          <Tag color={ROLE_COLORS[role]}>{role}</Tag>
        ) : (
          <Select
            size="small"
            value={role}
            options={ROLE_CHANGE_OPTIONS}
            loading={updatingRoleMemberId === member.id}
            disabled={updatingRoleMemberId === member.id}
            aria-label={`Role for ${member.displayName}`}
            onChange={(nextRole: AssignableRole) => changeRole(member.id, nextRole)}
          />
        ),
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
        <Text type="secondary">
          We email them a link, valid for 24 hours, to verify their address and choose their own
          password.
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
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select size="large" options={ROLE_OPTIONS} />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" loading={adding} size="large">
          Add to workspace
        </Button>
      </Form>
    </Card>
  );
};
