import type { FC } from "react";
import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

const { TextArea } = Input;

export interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
}

interface ClientFormModalProps {
  open: boolean;
  initialValues?: ClientFormData;
  loading?: boolean;
  onSubmit: (values: ClientFormData) => void | Promise<void>;
  onCancel: () => void;
}

export const ClientFormModal: FC<ClientFormModalProps> = ({
  open,
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<ClientFormData>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues ?? { name: "", email: "", phone: "", company: "", address: "", notes: "" });
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? "Edit Client" : "New Client"}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={initialValues ? "Save Changes" : "Create Client"}
      cancelText="Cancel"
      width={520}
      destroyOnClose
    >
      <Form form={form} layout="vertical" disabled={loading}>
        <Form.Item
          name="name"
          label="Client Name"
          rules={[
            { required: true, message: "Please enter the client name" },
            { max: 255, message: "Name must not exceed 255 characters" },
          ]}
        >
          <Input placeholder="Enter client name" size="large" />
        </Form.Item>

        <Form.Item name="company" label="Company">
          <Input placeholder="Enter company name" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Please enter a valid email address" }]}
        >
          <Input placeholder="Enter email address" size="large" />
        </Form.Item>

        <Form.Item name="phone" label="Phone">
          <Input placeholder="Enter phone number" size="large" />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input placeholder="Enter address" size="large" />
        </Form.Item>

        <Form.Item name="notes" label="Notes">
          <TextArea placeholder="Additional notes" rows={3} showCount maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
