import type { FC } from "react";
import { Card, Form, Input, Button, Tag, Space, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";

import type { StoryDraft } from "@/features/refinement/types";

import styles from "./story-editor.module.scss";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface StoryEditorProps {
  story: StoryDraft;
  onChange: (story: StoryDraft) => void;
  onSave: () => void;
  saving?: boolean;
}

export const StoryEditorComponent: FC<StoryEditorProps> = ({
  story,
  onChange,
  onSave,
  saving = false,
}) => {
  const [form] = Form.useForm();

  const handleAddCriteria = () => {
    const newCriteria = [...story.acceptanceCriteria, ""];
    onChange({ ...story, acceptanceCriteria: newCriteria });
  };

  const handleRemoveCriteria = (index: number) => {
    const newCriteria = story.acceptanceCriteria.filter((_, i) => i !== index);
    onChange({ ...story, acceptanceCriteria: newCriteria });
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const newCriteria = [...story.acceptanceCriteria];
    newCriteria[index] = value;
    onChange({ ...story, acceptanceCriteria: newCriteria });
  };

  const getStatusColor = (status: StoryDraft["status"]) => {
    const colors = {
      draft: "default",
      refining: "processing",
      refined: "success",
      approved: "success",
    };
    return colors[status];
  };

  return (
    <Card className={styles.editorCard}>
      <div className={styles.cardHeader}>
        <div>
          <Title level={3} className={styles.cardTitle}>
            Story Editor
          </Title>
          <Text className={styles.cardSubtitle}>
            Define your user story with clear acceptance criteria
          </Text>
        </div>
        <Tag color={getStatusColor(story.status)} className={styles.statusTag}>
          {story.status.toUpperCase()}
        </Tag>
      </div>

      <Form form={form} layout="vertical" className={styles.form}>
        <Form.Item label="Story Title" className={styles.formItem}>
          <Input
            size="large"
            placeholder="e.g., User can reset password via email"
            value={story.title}
            onChange={(e) => onChange({ ...story, title: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Description" className={styles.formItem}>
          <TextArea
            rows={4}
            placeholder="As a [user], I want to [action] so that [benefit]..."
            value={story.description}
            onChange={(e) => onChange({ ...story, description: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Acceptance Criteria" className={styles.formItem}>
          <Space direction="vertical" style={{ width: "100%" }} size="middle">
            {story.acceptanceCriteria.map((criteria, index) => (
              <div key={index} className={styles.criteriaRow}>
                <span className={styles.criteriaNumber}>{index + 1}</span>
                <TextArea
                  rows={2}
                  placeholder="Given [context], When [action], Then [outcome]"
                  value={criteria}
                  onChange={(e) => handleCriteriaChange(index, e.target.value)}
                  className={styles.criteriaInput}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveCriteria(index)}
                  className={styles.removeButton}
                />
              </div>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddCriteria} block>
              Add Acceptance Criterion
            </Button>
          </Space>
        </Form.Item>

        <div className={styles.formActions}>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={onSave}
            loading={saving}
          >
            Save Draft
          </Button>
        </div>
      </Form>
    </Card>
  );
};
