import type { FC } from "react";
import { useEffect } from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

import type { GeneratedStory } from "@/features/refinement/types";

import styles from "./edit-story-modal.module.scss";

const { TextArea } = Input;

interface EditStoryModalProps {
  open: boolean;
  story: GeneratedStory | null;
  onCancel: () => void;
  onSave: (story: GeneratedStory) => void;
  loading?: boolean;
}

interface FormValues {
  title: string;
  description: string;
  acceptanceCriteria: string[];
}

export const EditStoryModal: FC<EditStoryModalProps> = ({
  open,
  story,
  onCancel,
  onSave,
  loading = false,
}) => {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (story && open) {
      form.setFieldsValue({
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptanceCriteria,
      });
    }
  }, [story, open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!story) return;

      onSave({
        ...story,
        title: values.title,
        description: values.description,
        acceptanceCriteria: values.acceptanceCriteria,
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Story"
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSubmit} loading={loading}>
          Save Changes
        </Button>,
      ]}
      width={700}
      className={styles.modal}
    >
      <Form form={form} layout="vertical" className={styles.form}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter a title" },
            { min: 5, message: "Title must be at least 5 characters" },
          ]}
        >
          <Input placeholder="Enter story title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter a description" },
            { min: 10, message: "Description must be at least 10 characters" },
          ]}
        >
          <TextArea rows={4} placeholder="As a [user], I want [goal] so that [benefit]" />
        </Form.Item>

        <Form.Item label="Acceptance Criteria">
          <Form.List
            name="acceptanceCriteria"
            rules={[
              {
                validator: async (_, criteria) => {
                  if (!criteria || criteria.length < 1) {
                    return Promise.reject(new Error("At least one criterion is required"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field) => (
                  <Form.Item required={false} key={field.key} className={styles.criteriaItem}>
                    <Space.Compact style={{ width: "100%" }}>
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: "Please enter criterion or delete this field",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="Given [context], when [action], then [outcome]"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Space.Compact>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                    Add Criterion
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};
