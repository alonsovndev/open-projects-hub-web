import { useState } from "react";
import type { FC } from "react";
import { Alert, Card, Spin, Tag, Typography } from "antd";
import { RobotOutlined, ThunderboltOutlined } from "@ant-design/icons";

import { useAiProviders } from "@/features/settings/hooks/use-ai-providers";
import type { AiProvider } from "@/shared/types/ai";

import { ApiKeyModal } from "./ApiKeyModal";
import { ProviderKeyCard } from "./ProviderKeyCard";
import styles from "./ai-providers.module.scss";

const { Text } = Typography;

export const AiProvidersPanel: FC = () => {
  const {
    providers,
    keysByProvider,
    balance,
    loading,
    error,
    saving,
    deleting,
    validating,
    handleSaveKey,
    handleDeleteKey,
    handleValidateKey,
  } = useAiProviders();

  const [editingProvider, setEditingProvider] = useState<AiProvider | null>(null);

  if (loading) {
    return (
      <div className={styles.aiProviders}>
        <Spin tip="Loading AI settings" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.aiProviders}>
        <Alert
          type="error"
          showIcon
          message="We couldn't load your AI settings. Please try again."
        />
      </div>
    );
  }

  const hasNoKeys = providers.every((provider) => keysByProvider[provider] === undefined);
  const outOfCredits = balance !== null && balance.credits === 0;

  return (
    <div className={styles.aiProviders}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <RobotOutlined className={styles.icon} aria-hidden="true" />
          <div>
            <Text className={styles.title}>AI Providers</Text>
            <Text type="secondary" className={styles.subtitle}>
              Use your free platform credits, or bring your own provider key for unlimited
              refinements
            </Text>
          </div>
        </div>

        {balance !== null && (
          <div className={styles.creditSummary}>
            <Text className={styles.creditCopy}>
              <ThunderboltOutlined aria-hidden="true" /> Free platform credits
            </Text>
            <Tag color={balance.credits > 0 ? "processing" : "default"}>
              {balance.credits} of {balance.totalGranted} remaining
            </Tag>
          </div>
        )}

        {outOfCredits && hasNoKeys && (
          <Alert
            type="info"
            showIcon
            className={styles.creditCopy}
            style={{ marginBottom: 24 }}
            message="No credits remaining"
            description="Add your own API key below to continue. Your provider's usage limits and charges apply."
          />
        )}

        <div className={styles.providerList}>
          {providers.map((provider) => (
            <ProviderKeyCard
              key={provider}
              provider={provider}
              apiKey={keysByProvider[provider]}
              busy={saving || deleting || validating}
              onAdd={setEditingProvider}
              onDelete={handleDeleteKey}
              onValidate={handleValidateKey}
            />
          ))}
        </div>
      </Card>

      <ApiKeyModal
        provider={editingProvider}
        isReplacing={editingProvider !== null && keysByProvider[editingProvider] !== undefined}
        saving={saving}
        onCancel={() => setEditingProvider(null)}
        onSubmit={handleSaveKey}
      />
    </div>
  );
};
