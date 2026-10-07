import type { FC, KeyboardEvent } from "react";

import { Button, Modal } from "antd";

import { RequirementTransformation } from "@/features/home/components/requirement-transformation/RequirementTransformation";

import styles from "./home-example-modal.module.scss";

interface HomeExampleModalProps {
  open: boolean;
  onClose: () => void;
}

export const HomeExampleModal: FC<HomeExampleModalProps> = ({ open, onClose }) => {
  const handlePreviewTab = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusTargets = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]')
    );
    const currentIndex = focusTargets.findIndex((target) => target === event.target);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusTargets.length : currentIndex) - 1
      : (currentIndex + 1) % focusTargets.length;
    const nextTarget = focusTargets[nextIndex];

    // Safari can skip buttons during Tab navigation, bypassing AntD's focus trap.
    if (nextTarget) {
      event.preventDefault();
      nextTarget.focus();
    }
  };

  return (
    <Modal
      title="Example: from notes to story"
      open={open}
      onCancel={onClose}
      centered
      destroyOnHidden
      width="min(960px, calc(100vw - 32px))"
      wrapProps={{ onKeyDown: handlePreviewTab }}
      footer={
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      }
    >
      <div className={styles.body} tabIndex={0} role="region" aria-label="Example content">
        <p className={styles.description}>
          See how raw notes become an approved story. This is a read-only example; no account is
          required.
        </p>
        <RequirementTransformation idPrefix="sample-preview" presentation="preview" />
      </div>
    </Modal>
  );
};
