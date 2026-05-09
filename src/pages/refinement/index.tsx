import type { FC } from "react";
import { Typography, Row, Col } from "antd";

import { StoryEditor } from "@/features/refinement/components/story-editor";
import { SuggestionPanel } from "@/features/refinement/components/suggestion-panel";
import { useRefinementWorkspace } from "@/features/refinement/hooks/use-refinement-workspace";

import styles from "./refinement.module.scss";

const { Title, Text } = Typography;

export const RefinementPage: FC = () => {
  const {
    story,
    suggestions,
    refining,
    saving,
    handleStoryChange,
    handleRefine,
    handleApplySuggestion,
    handleSave,
  } = useRefinementWorkspace();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <Title level={1} className={styles.pageTitle}>
            AI Refinement Workspace
          </Title>
          <Text className={styles.pageSubtitle}>
            Collaborate with AI to refine user stories and acceptance criteria
          </Text>
        </div>
      </div>

      <Row gutter={[24, 24]} className={styles.workspaceGrid}>
        <Col xs={24} lg={12}>
          <StoryEditor
            story={story}
            onChange={handleStoryChange}
            onSave={handleSave}
            saving={saving}
          />
        </Col>
        <Col xs={24} lg={12}>
          <SuggestionPanel
            suggestions={suggestions}
            onApply={handleApplySuggestion}
            onRefine={handleRefine}
            loading={refining}
          />
        </Col>
      </Row>
    </div>
  );
};
export default RefinementPage;
