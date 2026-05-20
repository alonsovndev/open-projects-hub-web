import type { FC } from "react";
import { Form, Input, Select, DatePicker, Button, Card, Typography, Spin } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import type { ProjectStatus, ProjectPriority } from "@/features/dashboard/types";
import { useGetClientsQuery, selectClientSummaries } from "@/features/clients/api/clients-api";

import styles from "./project-form.module.scss";

const { TextArea } = Input;
const { Title } = Typography;

export interface ProjectFormData {
  name: string;
  code: string;
  clientId: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  dueDate: string;
}

interface ProjectFormProps {
  initialValues?: Partial<ProjectFormData>;
  onSubmit: (values: ProjectFormData) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  submitText?: string;
}

const statusOptions = [
  { label: "Planning", value: "planning" },
  { label: "Active", value: "active" },
  { label: "On Hold", value: "on-hold" },
  { label: "Completed", value: "completed" },
];

const priorityOptions = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const ProjectFormComponent: FC<ProjectFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Create Project",
}) => {
  const [form] = Form.useForm<ProjectFormData>();

  // Fetch clients for dropdown
  const {
    data: clientsData,
    isLoading: isLoadingClients,
    error: clientsError,
  } = useGetClientsQuery();

  const handleSubmit = async (values: ProjectFormData) => {
    // Convert dayjs to ISO string
    const formattedValues = {
      ...values,
      dueDate: dayjs(values.dueDate).format("YYYY-MM-DD"),
    };
    await onSubmit(formattedValues);
  };

  const formInitialValues = initialValues
    ? {
        ...initialValues,
        dueDate: initialValues.dueDate ? dayjs(initialValues.dueDate) : undefined,
      }
    : {
        status: "planning" as ProjectStatus,
        priority: "medium" as ProjectPriority,
      };

  const clientOptions = clientsData
    ? selectClientSummaries(clientsData.items).map((client) => ({
        label: client.company ? `${client.name} (${client.company})` : client.name,
        value: client.id,
      }))
    : [];

  // Show error message if clients failed to load
  const selectStatus = clientsError ? "error" : undefined;

  return (
    <Card className={styles.formCard}>
      <Title level={2} className={styles.formTitle}>
        {initialValues ? "Edit Project" : "Create New Project"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        initialValues={formInitialValues}
        onFinish={handleSubmit}
        className={styles.form}
        disabled={loading}
      >
        <div className={styles.formGrid}>
          <Form.Item
            name="name"
            label="Project Name"
            rules={[
              { required: true, message: "Please enter project name" },
              { min: 3, message: "Project name must be at least 3 characters" },
              { max: 100, message: "Project name must not exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter project name" size="large" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Project Code"
            rules={[
              { required: true, message: "Please enter project code" },
              {
                pattern: /^[A-Z0-9-]+$/,
                message: "Code must be uppercase letters, numbers, or hyphens",
              },
              { min: 2, message: "Code must be at least 2 characters" },
              { max: 20, message: "Code must not exceed 20 characters" },
            ]}
          >
            <Input placeholder="e.g., PROJ-2024" size="large" />
          </Form.Item>

          <Form.Item
            name="clientId"
            label="Client"
            rules={[{ required: true, message: "Please select a client" }]}
            help={clientsError ? "Failed to load clients. Please refresh the page." : undefined}
            validateStatus={selectStatus}
          >
            <Select
              options={clientOptions}
              placeholder={isLoadingClients ? "Loading clients..." : "Select client"}
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              loading={isLoadingClients}
              disabled={isLoadingClients || !!clientsError}
              notFoundContent={
                isLoadingClients ? (
                  <Spin size="small" />
                ) : clientsError ? (
                  "Error loading clients"
                ) : (
                  "No clients found"
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select project status" }]}
          >
            <Select options={statusOptions} placeholder="Select status" size="large" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select project priority" }]}
          >
            <Select options={priorityOptions} placeholder="Select priority" size="large" />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please select due date" }]}
          >
            <DatePicker
              placeholder="Select due date"
              size="large"
              style={{ width: "100%" }}
              disabledDate={(current) => current && current < dayjs().startOf("day")}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "Please enter project description" },
            { min: 10, message: "Description must be at least 10 characters" },
            { max: 500, message: "Description must not exceed 500 characters" },
          ]}
        >
          <TextArea
            placeholder="Enter project description"
            rows={4}
            showCount
            maxLength={500}
            size="large"
          />
        </Form.Item>

        <div className={styles.formActions}>
          <Button size="large" icon={<CloseOutlined />} onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            className={styles.submitButton}
          >
            {submitText}
          </Button>
        </div>
      </Form>
    </Card>
  );
};
