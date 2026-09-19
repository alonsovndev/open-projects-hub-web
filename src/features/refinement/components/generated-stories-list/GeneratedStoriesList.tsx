import type { FC } from "react";
import { Card, Button, Space, Typography, Checkbox, Empty, Divider } from "antd";
import { CheckOutlined, EditOutlined, DeleteOutlined, BulbOutlined } from "@ant-design/icons";

import type { GeneratedStory } from "@/features/refinement/types";

import styles from "./generated-stories-list.module.scss";

const { Title, Text, Paragraph } = Typography;

interface GeneratedStoriesListProps {
  stories: GeneratedStory[];
  onApprove: (draftId: string) => void;
  onApproveAll: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  loading?: boolean;
  approvingIds?: string[];
}

export const GeneratedStoriesList: FC<GeneratedStoriesListProps> = ({
  stories,
  onApprove,
  onApproveAll,
  onEdit,
  onDelete,
  loading = false,
  approvingIds = [],
}) => {
  return (
    <Card className={styles.listCard}>
      <div className={styles.cardHeader}>
        <div>
          <Title level={3} className={styles.cardTitle}>
            Generated Stories (Draft)
          </Title>
          <Text className={styles.cardSubtitle}>
            {stories.length} {stories.length === 1 ? "draft" : "drafts"} pending approval
          </Text>
        </div>
        {stories.length > 0 && (
          <Button
            type="primary"
            size="large"
            icon={<CheckOutlined />}
            onClick={onApproveAll}
            loading={loading}
            className={styles.approveButton}
          >
            Approve All Stories
          </Button>
        )}
      </div>

      {stories.length === 0 ? (
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
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {stories.map((story, index) => (
            <div key={index} className={styles.storyCard}>
              <div className={styles.storyHeader}>
                <div className={styles.storyTitleRow}>
                  <Text strong className={styles.storyTitle}>
                    {story.title}
                  </Text>
                </div>
                <div className={styles.storyActions}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    icon={<CheckOutlined />}
                    className={styles.approveBtn}
                    onClick={() => onApprove(story.id)}
                    loading={approvingIds.includes(story.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(index)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <Paragraph className={styles.storyDescription} italic>
                {story.description}
              </Paragraph>

              <Divider className={styles.divider} />

              <div className={styles.criteriaSection}>
                <Text strong className={styles.criteriaLabel}>
                  ACCEPTANCE CRITERIA
                </Text>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  {story.acceptanceCriteria.map((criteria, idx) => (
                    <div key={idx} className={styles.criteriaItem}>
                      <Checkbox className={styles.criteriaCheckbox} />
                      <Text className={styles.criteriaText}>{criteria}</Text>
                    </div>
                  ))}
                </Space>
              </div>
            </div>
          ))}
        </Space>
      )}
    </Card>
  );
};
