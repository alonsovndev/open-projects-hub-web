import type { FC } from "react";
import { Button, Modal, Typography } from "antd";

import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";

const { Paragraph } = Typography;

export const WelcomeModal: FC = () => {
  const { shouldShow, saving, complete } = useOnboarding();

  return (
    <Modal
      open={shouldShow}
      title="Welcome to Open Projects Hub"
      onCancel={complete}
      footer={
        <Button type="primary" loading={saving} onClick={complete}>
          Got it
        </Button>
      }
    >
      <Paragraph>Your workspace is ready. A good way to start:</Paragraph>
      <ol>
        <li>Add a client, then create a project for them.</li>
        <li>
          Use <strong>AI Refinement</strong> to turn rough notes into user stories. Your account
          includes free refinements, so you can try it before adding your own AI key.
        </li>
        <li>Share the project with your client so they can follow progress.</li>
      </ol>
      <Paragraph type="secondary">
        You can bring this welcome back any time from Settings.
      </Paragraph>
    </Modal>
  );
};
