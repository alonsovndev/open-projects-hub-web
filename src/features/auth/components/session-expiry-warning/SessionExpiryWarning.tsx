import type { FC } from "react";
import { Modal } from "antd";

import { useSessionExpiryWarning } from "@/features/auth/hooks/use-session-expiry-warning";

export const SessionExpiryWarning: FC = () => {
  const { isWarningVisible, isExtending, extendSession, dismiss } = useSessionExpiryWarning();

  return (
    <Modal
      title="Your session is about to expire"
      open={isWarningVisible}
      onOk={extendSession}
      onCancel={dismiss}
      okText="Stay signed in"
      cancelText="Dismiss"
      confirmLoading={isExtending}
      closable={false}
      maskClosable={false}
    >
      <p>You'll be signed out soon due to inactivity. Would you like to stay signed in?</p>
    </Modal>
  );
};
