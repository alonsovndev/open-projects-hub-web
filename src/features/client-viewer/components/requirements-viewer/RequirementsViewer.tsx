import type { FC } from "react";

import { LogoutOutlined } from "@ant-design/icons";
import { Button, Card, Layout, Tag, Typography } from "antd";

import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";
import type { ProjectRequirementsRecord } from "@/features/client-viewer/types";

import styles from "./requirements-viewer.module.scss";

interface RequirementsViewerProps {
  project: ProjectRequirementsRecord;
  onSignOut: () => void;
}

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

export const RequirementsViewer: FC<RequirementsViewerProps> = ({ project, onSignOut }) => {
  return (
    <Layout className={styles.layout}>
      <AppHeader
        actions={
          <Button type="text" icon={<LogoutOutlined />} className={styles.headerAction} onClick={onSignOut}>
            Sign Out
          </Button>
        }
      >
        <Tag className={styles.roleTag}>Viewer</Tag>
      </AppHeader>

      <Content className={styles.content}>
        <div className={styles.contentInner}>
          <Title level={1} className={styles.pageTitle}>
            Project Requirements — {project.projectTitle}
          </Title>

          <div className={styles.storyList}>
            {project.stories.map((story) => (
              <Card key={story.id} className={styles.storyCard}>
                <div className={styles.storyHeader}>
                  <Title level={3} className={styles.storyTitle}>
                    {story.title}
                  </Title>

                  <Tag className={styles.approvedTag}>{story.status}</Tag>
                </div>

                <Paragraph className={styles.storySummary}>
                  As a <strong>{story.userStory.userRole}</strong>, I want to <strong>{story.userStory.goal}</strong>, so that <strong>{story.userStory.benefit}</strong>.
                </Paragraph>

                <div className={styles.criteriaPanel}>
                  <Text className={styles.criteriaTitle}>Acceptance Criteria</Text>

                  <ul className={styles.criteriaList}>
                    {story.acceptanceCriteria.map((criterion) => (
                      <li key={`${criterion.given}-${criterion.when}-${criterion.then}`}>
                        <strong>Given</strong> {criterion.given}, <strong>when</strong> {criterion.when}, <strong>then</strong> {criterion.then}.
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};
