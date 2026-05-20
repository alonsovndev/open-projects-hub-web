import type { FC } from "react";
import { useEffect } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

const { TextArea } = Input;

export interface EditProjectFormData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

interface EditProjectFormFields {
  name: string;
  description?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
}

interface EditProjectModalProps {
  open: boolean;
  initialValues?: EditProjectFormData;
  loading?: boolean;
  onSubmit: (values: EditProjectFormData) => void | Promise<void>;
  onCancel: () => void;
}

export const EditProjectModal: FC<EditProjectModalProps> = ({
  open,
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<EditProjectFormFields>();

  // Update form values when modal opens with new data
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        startDate: initialValues.startDate ? dayjs(initialValues.startDate) : undefined,
        endDate: initialValues.endDate ? dayjs(initialValues.endDate) : undefined,
      });
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert dayjs to ISO string for dates
      const formattedValues: EditProjectFormData = {
        name: values.name,
        description: values.description,
        startDate: values.startDate ? dayjs(values.startDate).format("YYYY-MM-DD") : undefined,
        endDate: values.endDate ? dayjs(values.endDate).format("YYYY-MM-DD") : undefined,
      };

      await onSubmit(formattedValues);
      form.resetFields();
    } catch (error) {
      // Form validation failed
      console.error("Form validation error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Project"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Save Changes"
      cancelText="Cancel"
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" disabled={loading}>
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
          name="description"
          label="Description"
          rules={[{ max: 500, message: "Description must not exceed 500 characters" }]}
        >
          <TextArea placeholder="Enter project description" rows={4} showCount maxLength={500} />
        </Form.Item>

        <Form.Item name="startDate" label="Start Date">
          <DatePicker style={{ width: "100%" }} size="large" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          dependencies={["startDate"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue("startDate");
                if (!value || !startDate) {
                  return Promise.resolve();
                }
                const end = dayjs(value);
                const start = dayjs(startDate);
                if (end.isAfter(start) || end.isSame(start, "day")) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("End date must be on or after start date"));
              },
            }),
          ]}
        >
          <DatePicker style={{ width: "100%" }} size="large" format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
