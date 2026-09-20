import type { FC } from "react";
import { Modal, Typography, Alert } from "antd";
import { CheckOutlined } from "@ant-design/icons";

import type { GeneratedStory } from "@/features/refinement/types";

import styles from "./approve-story-modal.module.scss";

const { Text, Paragraph } = Typography;

interface ApproveStoryModalProps {
  open: boolean;
  story: GeneratedStory | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

/**
 * Confirms the one-way step from AI draft to official backlog story.
 *
 * Approval is deliberately a separate, confirmed action from generation: nothing reaches
 * the backlog or a Viewer without an Admin saying so (FR-002-03).
 */
export const ApproveStoryModal: FC<ApproveStoryModalProps> = ({
  open,
  story,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      title="Approve this story?"
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Approve and add to backlog"
      okButtonProps={{ icon: <CheckOutlined />, loading }}
      cancelText="Keep as draft"
      // Ant Design traps focus inside an open Modal and closes it on Escape; keeping the
      // focus trigger restores focus to the Approve button on close.
      focusTriggerAfterClose
      destroyOnHidden
      width={560}
    >
      <Alert
        type="info"
        showIcon
        className={styles.notice}
        message="Approved stories become part of the official backlog and are visible to Viewers."
      />

      {story && (
        <div className={styles.preview}>
          <Text strong className={styles.previewTitle}>
            {story.title}
          </Text>
          <Paragraph className={styles.previewDescription} italic>
            {story.description}
          </Paragraph>
          <Text className={styles.previewMeta}>
            {story.acceptanceCriteria.length}{" "}
            {story.acceptanceCriteria.length === 1 ? "acceptance criterion" : "acceptance criteria"}
          </Text>
        </div>
      )}
    </Modal>
  );
};
