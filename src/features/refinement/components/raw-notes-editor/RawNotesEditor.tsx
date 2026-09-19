import type { FC } from "react";
import { Card, Form, Button, Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import styles from "./raw-notes-editor.module.scss";

const { Title, Text } = Typography;

interface RawNotesEditorProps {
  rawNotes: string;
  onChange: (notes: string) => void;
  onGenerate: () => void;
  loading?: boolean;
}

export const RawNotesEditor: FC<RawNotesEditorProps> = ({
  rawNotes,
  onChange,
  onGenerate,
  loading = false,
}) => {
  return (
    <Card className={styles.editorCard}>
      <div className={styles.cardHeader}>
        <div>
          <Title level={3} className={styles.cardTitle}>
            <ThunderboltOutlined className={styles.aiIcon} />
            AI Refinement
          </Title>
          <Text className={styles.cardSubtitle}>Raw Discovery Notes</Text>
        </div>
      </div>

      <Form layout="vertical" className={styles.form}>
        <Form.Item className={styles.formItem}>
          <TextArea
            rows={15}
            placeholder={`Paste your raw discovery notes here. The AI will analyze these notes to generate user stories and acceptance criteria. For best results, include detailed information about user needs, pain points, and any relevant context.`}
            value={rawNotes}
            onChange={(e) => onChange(e.target.value)}
            className={styles.notesInput}
          />
        </Form.Item>

        <div className={styles.formActions}>
          <Button
            type="default"
            size="large"
            onClick={() => onChange("")}
            disabled={!rawNotes || loading}
          >
            Clear
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            onClick={onGenerate}
            loading={loading}
            disabled={!rawNotes || rawNotes.length < 20}
          >
            Generate Stories
          </Button>
        </div>
      </Form>
    </Card>
  );
};
