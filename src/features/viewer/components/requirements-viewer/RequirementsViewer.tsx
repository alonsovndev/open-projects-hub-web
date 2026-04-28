import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { LogoutOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Tag, Typography, Divider } from "antd";

import { AppHeader } from "@/shared/components/layout/app-header";
import type { ProjectRequirementsRecord } from "@/features/viewer/types";

import styles from "./requirements-viewer.module.scss";

interface RequirementsViewerProps {
  project: ProjectRequirementsRecord;
  onSignOut: () => void;
}

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

export const RequirementsViewer: FC<RequirementsViewerProps> = ({ project, onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    onSignOut();
    navigate("/viewer");
  };

  return (
    <Layout className={styles.layout}>
      <AppHeader
        actions={
          <Button
            type="text"
            icon={<LogoutOutlined />}
            className={styles.headerAction}
            onClick={handleSignOut}
          >
            Exit Viewer
          </Button>
        }
      >
        <Tag className={styles.roleTag} color="blue">
          Viewer Mode
        </Tag>
      </AppHeader>

      <Content className={styles.content}>
        <div className={styles.contentInner}>
          <div className={styles.projectHeader}>
            <div className={styles.projectInfo}>
              <Title level={1} className={styles.projectTitle}>
                {project.projectTitle}
              </Title>
              <Text className={styles.projectCode}>Project ID: {project.code}</Text>
            </div>
            <Tag className={styles.storiesCount} color="green">
              {project.stories.length} {project.stories.length === 1 ? "Story" : "Stories"}
            </Tag>
          </div>

          <Divider className={styles.headerDivider} />

          <div className={styles.storyList}>
            {project.stories.map((story, index) => (
              <Card key={story.id} className={styles.storyCard}>
                <div className={styles.storyHeader}>
                  <div className={styles.storyTitleGroup}>
                    <div className={styles.storyNumber}>Story #{index + 1}</div>
                    <Title level={3} className={styles.storyTitle}>
                      {story.title}
                    </Title>
                  </div>

                  <Tag className={styles.statusTag} icon={<CheckCircleOutlined />} color="success">
                    {story.status}
                  </Tag>
                </div>

                <div className={styles.userStorySection}>
                  <Text className={styles.sectionLabel}>User Story</Text>
                  <Paragraph className={styles.userStoryText}>
                    As a <span className={styles.highlight}>{story.userStory.userRole}</span>, I
                    want to <span className={styles.highlight}>{story.userStory.goal}</span>, so
                    that <span className={styles.highlight}>{story.userStory.benefit}</span>.
                  </Paragraph>
                </div>

                <div className={styles.criteriaSection}>
                  <Text className={styles.sectionLabel}>Acceptance Criteria</Text>

                  <div className={styles.criteriaList}>
                    {story.acceptanceCriteria.map((criterion, criterionIndex) => (
                      <div
                        key={`${criterion.given}-${criterion.when}-${criterion.then}`}
                        className={styles.criterionItem}
                      >
                        <div className={styles.criterionNumber}>{criterionIndex + 1}</div>
                        <div className={styles.criterionContent}>
                          <div className={styles.criterionRow}>
                            <span className={styles.criterionKeyword}>Given</span>{" "}
                            <span className={styles.criterionText}>{criterion.given}</span>
                          </div>
                          <div className={styles.criterionRow}>
                            <span className={styles.criterionKeyword}>When</span>{" "}
                            <span className={styles.criterionText}>{criterion.when}</span>
                          </div>
                          <div className={styles.criterionRow}>
                            <span className={styles.criterionKeyword}>Then</span>{" "}
                            <span className={styles.criterionText}>{criterion.then}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Content>
    </Layout>
  );
};
