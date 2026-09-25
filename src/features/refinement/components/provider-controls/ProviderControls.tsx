import type { FC } from "react";
import { Select, Space, Tag, Tooltip, Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

import { REFINEMENT_PROVIDER_LABELS } from "@/shared/types/ai";
import type { CreditBalance, RefinementProvider } from "@/shared/types/ai";

import styles from "./provider-controls.module.scss";

const { Text } = Typography;

interface ProviderControlsProps {
  balance: CreditBalance | null;
  providerOptions: RefinementProvider[];
  selectedProvider: RefinementProvider | null;
  onProviderChange: (provider: RefinementProvider) => void;
}

export const ProviderControls: FC<ProviderControlsProps> = ({
  balance,
  providerOptions,
  selectedProvider,
  onProviderChange,
}) => {
  // Disabled rather than hidden when there is one choice: the label still tells the user
  // what their refinement will run on, which is the point of showing it (FR-010-06).
  const isSingleChoice = providerOptions.length <= 1;

  return (
    <Space className={styles.providerControls} size="large" wrap>
      {balance !== null && (
        <div className={styles.creditGroup}>
          <Text className={styles.label} id="refinement-credit-label">
            Credits
          </Text>
          <Tooltip title={`${balance.credits} of ${balance.totalGranted} free refinements left`}>
            <Tag
              icon={<ThunderboltOutlined />}
              color={balance.credits > 0 ? "processing" : "default"}
              aria-labelledby="refinement-credit-label"
            >
              {balance.credits} / {balance.totalGranted}
            </Tag>
          </Tooltip>
        </div>
      )}

      {providerOptions.length > 0 && (
        <div className={styles.providerGroup}>
          <Text className={styles.label} id="refinement-provider-label">
            Provider
          </Text>
          <Select
            aria-labelledby="refinement-provider-label"
            className={styles.providerSelect}
            value={selectedProvider ?? undefined}
            onChange={onProviderChange}
            disabled={isSingleChoice}
            size="large"
            options={providerOptions.map((provider) => ({
              label: REFINEMENT_PROVIDER_LABELS[provider],
              value: provider,
            }))}
          />
        </div>
      )}
    </Space>
  );
};
