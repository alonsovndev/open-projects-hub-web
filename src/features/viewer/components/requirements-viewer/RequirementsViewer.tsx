import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Empty, Layout, Tag, Typography } from "antd";

import { AppHeader } from "@/shared/components/layout/app-header";
import { PROJECT_PRIORITY_COLORS } from "@/shared/types/domain";
import type { StoryStatus } from "@/features/backlog/types";
import type { ClientReview } from "@/features/viewer/types";

import styles from "./requirements-viewer.module.scss";

interface RequirementsViewerProps {
  review: ClientReview;
}

const { Paragraph, Text, Title } = Typography;

const STATUS_DISPLAY: Record<StoryStatus, { label: string; color: string }> = {
  backlog: { label: "Planned", color: "default" },
  ready: { label: "Ready", color: "processing" },
  "in-progress": { label: "In progress", color: "warning" },
  review: { label: "In review", color: "purple" },
  done: { label: "Done", color: "success" },
};

export const RequirementsViewer: FC<RequirementsViewerProps> = ({ review }) => {
  const navigate = useNavigate();

  return (
    <Layout className={styles.layout}>
      <AppHeader
        actions={
          <Button
            type="text"
            icon={<SearchOutlined />}
            className={styles.headerAction}
            onClick={() => navigate("/viewer")}
          >
            Use another code
          </Button>
        }
      >
        <Tag className={styles.roleTag} color="blue">
          Client Review
        </Tag>
      </AppHeader>

      <div className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.projectHeader}>
            <div className={styles.projectInfo}>
              <Title level={1} className={styles.projectTitle}>
                {review.projectName}
              </Title>
              <Text className={styles.projectCode}>Phase: {review.phase}</Text>
            </div>
            <Tag className={styles.storiesCount} color="green">
              {review.total} approved {review.total === 1 ? "story" : "stories"}
            </Tag>
          </div>

          <Divider className={styles.headerDivider} />

          {review.stories.length === 0 ? (
            <Empty description="No approved stories yet. Your freelancer will add them here once they are approved." />
          ) : (
            <div className={styles.storyList}>
              {review.stories.map((story, index) => (
                <Card key={story.id} className={styles.storyCard}>
                  <div className={styles.storyHeader}>
                    <div className={styles.storyTitleGroup}>
                      <div className={styles.storyNumber}>Story #{index + 1}</div>
                      <Title level={3} className={styles.storyTitle}>
                        {story.title}
                      </Title>
                    </div>

                    <div>
                      <Tag className={styles.statusTag} color={STATUS_DISPLAY[story.status].color}>
                        {STATUS_DISPLAY[story.status].label}
                      </Tag>
                      <Tag
                        className={styles.statusTag}
                        color={PROJECT_PRIORITY_COLORS[story.priority]}
                      >
                        {story.priority} priority
                      </Tag>
                    </div>
                  </div>

                  {story.description ? (
                    <div className={styles.userStorySection}>
                      <Text className={styles.sectionLabel}>Description</Text>
                      <Paragraph className={styles.userStoryText}>{story.description}</Paragraph>
                    </div>
                  ) : null}

                  {story.acceptanceCriteria.length > 0 ? (
                    <div className={styles.criteriaSection}>
                      <Text className={styles.sectionLabel}>Acceptance Criteria</Text>

                      <div className={styles.criteriaList}>
                        {story.acceptanceCriteria.map((criterion, criterionIndex) => (
                          <div
                            key={`${criterionIndex}-${criterion}`}
                            className={styles.criterionItem}
                          >
                            <div className={styles.criterionNumber}>{criterionIndex + 1}</div>
                            <div className={styles.criterionContent}>
                              <span className={styles.criterionText}>{criterion}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
