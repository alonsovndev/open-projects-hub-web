import type { FC } from "react";
import { Button, Card, Typography } from "antd";

import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";

import styles from "./onboarding-reset.module.scss";

const { Text } = Typography;

export const OnboardingReset: FC = () => {
  const { saving, reset } = useOnboarding();

  return (
    <Card>
      <Text strong>Welcome guide</Text>
      <div>
        <Text type="secondary">Show the first-use welcome again on your dashboard.</Text>
      </div>
      <Button onClick={reset} loading={saving} className={styles.resetButton}>
        Reset onboarding
      </Button>
    </Card>
  );
};
