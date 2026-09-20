import type { FC } from "react";
import { Card, Form, Button, Typography, Alert } from "antd";
import { ThunderboltOutlined, RedoOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

import { RAW_NOTES_MAX_LENGTH, RAW_NOTES_MIN_LENGTH } from "@/features/refinement/types";

import styles from "./raw-notes-editor.module.scss";

const { Title, Text } = Typography;

const NOTES_PLACEHOLDER = `Paste your raw discovery notes here — plain text or a bullet list both work.

The AI turns these into draft user stories with acceptance criteria. For the best results, describe user needs, pain points, and any relevant context.`;

interface RawNotesEditorProps {
  rawNotes: string;
  onChange: (notes: string) => void;
  onGenerate: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onDismissError?: () => void;
}

export const RawNotesEditor: FC<RawNotesEditorProps> = ({
  rawNotes,
  onChange,
  onGenerate,
  loading = false,
  error = null,
  onRetry,
  onDismissError,
}) => {
  const isTooShort = rawNotes.length > 0 && rawNotes.length < RAW_NOTES_MIN_LENGTH;
  const canGenerate = rawNotes.length >= RAW_NOTES_MIN_LENGTH;

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

      {error && (
        <Alert
          type="error"
          showIcon
          className={styles.errorAlert}
          message="Refinement failed"
          description={error}
          closable={Boolean(onDismissError)}
          onClose={onDismissError}
          action={
            onRetry && (
              <Button size="small" icon={<RedoOutlined />} onClick={onRetry} loading={loading}>
                Retry
              </Button>
            )
          }
        />
      )}

      <Form layout="vertical" className={styles.form}>
        <Form.Item
          className={styles.formItem}
          label="Discovery notes"
          htmlFor="raw-notes"
          validateStatus={isTooShort ? "warning" : undefined}
          help={
            isTooShort
              ? `Add at least ${RAW_NOTES_MIN_LENGTH} characters so the AI has something to work with.`
              : undefined
          }
        >
          <TextArea
            id="raw-notes"
            rows={15}
            placeholder={NOTES_PLACEHOLDER}
            value={rawNotes}
            onChange={(e) => onChange(e.target.value)}
            maxLength={RAW_NOTES_MAX_LENGTH}
            showCount
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
            disabled={!canGenerate}
          >
            Generate Stories
          </Button>
        </div>
      </Form>
    </Card>
  );
};
