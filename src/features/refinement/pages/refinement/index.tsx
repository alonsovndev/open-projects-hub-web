import type { FC } from "react";
import { Typography, Row, Col, Select, Alert } from "antd";

import { RawNotesEditor } from "@/features/refinement/components/raw-notes-editor";
import { GeneratedStoriesList } from "@/features/refinement/components/generated-stories-list";
import { EditStoryModal } from "@/features/refinement/components/edit-story-modal";
import { useRefinement } from "@/features/refinement/hooks/use-refinement";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./refinement.module.scss";

const { Title, Text } = Typography;

export const RefinementPage: FC = () => {
  usePageTitle("AI Refinement");

  const {
    selectedProjectId,
    rawNotes,
    generatedStories,
    approvingIds,
    editingStory,
    isEditModalOpen,
    projectOptions,
    isLoadingProjects,
    isGenerating,
    isApprovingAll,
    isUpdating,
    handleProjectChange,
    handleNotesChange,
    handleGenerate,
    handleApprove,
    handleApproveAll,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  } = useRefinement();

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
        <div className={styles.projectSelector}>
          <Text strong style={{ marginRight: 8 }}>
            Project:
          </Text>
          <Select
            style={{ width: 300 }}
            placeholder="Select a project"
            options={projectOptions}
            value={selectedProjectId || undefined}
            onChange={handleProjectChange}
            loading={isLoadingProjects}
            showSearch
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            allowClear
          />
        </div>
      </div>

      <Alert
        type="info"
        message="AI-Generated Content"
        description="AI can make mistakes. Story refinements are sent to a third-party AI service for processing. Do not include sensitive or personal information. Review all generated content before use."
        showIcon
        className={styles.disclaimerAlert}
      />

      <Row gutter={[24, 24]} className={styles.workspaceGrid}>
        <Col xs={24} lg={10}>
          <RawNotesEditor
            rawNotes={rawNotes}
            onChange={handleNotesChange}
            onGenerate={handleGenerate}
            loading={isGenerating}
          />
        </Col>
        <Col xs={24} lg={14}>
          <GeneratedStoriesList
            stories={generatedStories}
            onApprove={handleApprove}
            onApproveAll={handleApproveAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={isApprovingAll}
            approvingIds={approvingIds}
          />
        </Col>
      </Row>

      <EditStoryModal
        open={isEditModalOpen}
        story={editingStory}
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
        loading={isUpdating}
      />
    </div>
  );
};
export default RefinementPage;
