import type { FC } from "react";
import { useEffect, useState } from "react";
import { Card, Button, Space, Typography, Empty, Divider, Tag, Progress } from "antd";
import { CheckOutlined, EditOutlined, DeleteOutlined, BulbOutlined } from "@ant-design/icons";

import type { GeneratedStory } from "@/features/refinement/types";

import styles from "./generated-stories-list.module.scss";

const { Title, Text, Paragraph } = Typography;

/** How long a refinement may look inert before the UI explains itself (NFR-002-02). */
const SLOW_GENERATION_MS = 3000;

interface GeneratedStoriesListProps {
  stories: GeneratedStory[];
  onApprove: (storyId: string) => void;
  onApproveAll: () => void;
  onEdit: (storyId: string) => void;
  onDelete: (storyId: string) => void;
  loading?: boolean;
  generating?: boolean;
  approvingIds?: string[];
}

const GeneratingState: FC = () => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsSlow(true), SLOW_GENERATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.generatingState} role="status" aria-live="polite">
      <Progress percent={100} status="active" showInfo={false} className={styles.generatingBar} />
      <Text className={styles.generatingTitle}>Refining your notes into draft stories…</Text>
      <Text className={styles.generatingHint}>
        {isSlow
          ? "Still working. Longer notes take more time — this page will update as soon as the drafts are ready."
          : "This usually takes a few seconds."}
      </Text>
    </div>
  );
};

export const GeneratedStoriesList: FC<GeneratedStoriesListProps> = ({
  stories,
  onApprove,
  onApproveAll,
  onEdit,
  onDelete,
  loading = false,
  generating = false,
  approvingIds = [],
}) => {
  const renderBody = () => {
    if (generating) return <GeneratingState />;

    if (stories.length === 0) {
      return (
        <Empty
          image={<BulbOutlined className={styles.emptyIcon} />}
          description={
            <Space direction="vertical" size="small">
              <Text className={styles.emptyTitle}>No stories generated yet</Text>
              <Text className={styles.emptyText}>
                Enter discovery notes and click "Generate Stories" to create user stories with AI
              </Text>
            </Space>
          }
          className={styles.empty}
        />
      );
    }

    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {stories.map((story) => {
          // While a draft's approval is in flight it must not also be edited or
          // discarded: either would race the approval and report the wrong outcome.
          const isApproving = approvingIds.includes(story.id);

          return (
            <div key={story.id} className={styles.storyCard}>
              <div className={styles.storyHeader}>
                <div className={styles.storyTitleRow}>
                  {/* Labelled in words, not by color alone, per WCAG 1.4.1. */}
                  <Tag color="gold" className={styles.statusTag}>
                    Draft — not in backlog
                  </Tag>
                  <Text strong className={styles.storyTitle}>
                    {story.title}
                  </Text>
                </div>
                <div className={styles.storyActions}>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(story.id)}
                    disabled={isApproving}
                  >
                    Edit
                  </Button>
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    className={styles.approveBtn}
                    onClick={() => onApprove(story.id)}
                    loading={isApproving}
                  >
                    Approve
                  </Button>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(story.id)}
                    disabled={isApproving}
                  >
                    Discard
                  </Button>
                </div>
              </div>

              <Paragraph className={styles.storyDescription}>{story.description}</Paragraph>

              <Divider className={styles.divider} />

              <div className={styles.criteriaSection}>
                <Text strong className={styles.criteriaLabel}>
                  Acceptance criteria
                </Text>
                <ul className={styles.criteriaList}>
                  {story.acceptanceCriteria.map((criteria, index) => (
                    <li key={`${story.id}-${index}`} className={styles.criteriaItem}>
                      <Text className={styles.criteriaText}>{criteria}</Text>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </Space>
    );
  };

  return (
    <Card className={styles.listCard}>
      <div className={styles.cardHeader}>
        <div>
          <Title level={3} className={styles.cardTitle}>
            Generated Stories (Draft)
          </Title>
          <Text className={styles.cardSubtitle}>
            {stories.length} {stories.length === 1 ? "draft" : "drafts"} pending approval · saved in
            this tab only, lost when you close it
          </Text>
        </div>
        {stories.length > 0 && !generating && (
          <Button
            type="primary"
            size="large"
            icon={<CheckOutlined />}
            onClick={onApproveAll}
            loading={loading}
            // A bulk approve would resubmit a draft that is already being approved
            // individually, creating it in the backlog twice.
            disabled={approvingIds.length > 0}
            className={styles.approveButton}
          >
            Approve All Stories
          </Button>
        )}
      </div>

      {renderBody()}
    </Card>
  );
};
