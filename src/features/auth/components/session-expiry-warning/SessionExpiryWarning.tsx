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
      <p>Your session expires soon. Select “Stay signed in” to continue.</p>
    </Modal>
  );
};
