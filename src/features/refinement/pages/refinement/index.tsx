import type { FC } from "react";
import { Typography, Row, Col, Select, Alert, Card } from "antd";
import { ProjectOutlined, UserOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { RawNotesEditor } from "@/features/refinement/components/raw-notes-editor";
import { GeneratedStoriesList } from "@/features/refinement/components/generated-stories-list";
import { EditStoryModal } from "@/features/refinement/components/edit-story-modal";
import { ApproveStoryModal } from "@/features/refinement/components/approve-story-modal";
import { useRefinement } from "@/features/refinement/hooks/use-refinement";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./refinement.module.scss";

const { Title, Text } = Typography;

export const RefinementPage: FC = () => {
  usePageTitle("AI Refinement");

  const {
    selectedProjectId,
    selectedProject,
    rawNotes,
    generatedStories,
    approvingIds,
    editingStory,
    isEditModalOpen,
    pendingApproval,
    generationError,
    redactionCount,
    projectOptions,
    isLoadingProjects,
    isGenerating,
    isApprovingAll,
    isUpdating,
    handleProjectChange,
    handleNotesChange,
    handleGenerate,
    handleRetryGeneration,
    handleDismissError,
    handleRequestApproval,
    handleConfirmApproval,
    handleCancelApproval,
    handleApproveAll,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
  } = useRefinement();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Title level={1} className={styles.pageTitle}>
          AI Refinement Workspace
        </Title>
        <Text className={styles.pageSubtitle}>
          Collaborate with AI to refine user stories and acceptance criteria
        </Text>
      </div>

      <div className={styles.projectSection}>
        <div className={styles.projectSelector}>
          <Text className={styles.selectorLabel}>Project</Text>
          <Select
            style={{ width: 500 }}
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
            size="large"
          />
        </div>

        {selectedProject && (
          <Card className={styles.projectSummaryCard} size="small">
            <Row gutter={16} align="middle">
              <Col>
                <div className={styles.projectName}>
                  <ProjectOutlined className={styles.summaryIcon} />
                  <Text strong>{selectedProject.name}</Text>
                  <Text code className={styles.projectCode}>
                    {selectedProject.code}
                  </Text>
                </div>
              </Col>
              <Col flex="auto">
                <Text className={styles.projectClient}>
                  <UserOutlined /> {selectedProject.clientName}
                </Text>
              </Col>
            </Row>
          </Card>
        )}
      </div>

      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message="AI can make mistakes. Story refinements use a third-party AI service. Do not include sensitive information. Review before use."
        className={styles.disclaimerAlert}
      />

      <Row gutter={[24, 24]} className={styles.workspaceGrid}>
        <Col xs={24} lg={10} className={styles.workspaceCol}>
          <RawNotesEditor
            rawNotes={rawNotes}
            onChange={handleNotesChange}
            onGenerate={handleGenerate}
            loading={isGenerating}
            error={generationError}
            redactionCount={redactionCount}
            onRetry={handleRetryGeneration}
            onDismissError={handleDismissError}
          />
        </Col>
        <Col xs={24} lg={14} className={`${styles.workspaceCol} ${styles.generatedStoriesCol}`}>
          <GeneratedStoriesList
            stories={generatedStories}
            onApprove={handleRequestApproval}
            onApproveAll={handleApproveAll}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={isApprovingAll}
            generating={isGenerating}
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

      <ApproveStoryModal
        open={Boolean(pendingApproval)}
        story={pendingApproval}
        onCancel={handleCancelApproval}
        onConfirm={handleConfirmApproval}
        loading={Boolean(pendingApproval && approvingIds.includes(pendingApproval.id))}
      />
    </div>
  );
};
export default RefinementPage;
