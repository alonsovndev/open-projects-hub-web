import type { FC } from "react";
import { Button, Card, Popconfirm, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined, DeleteOutlined, KeyOutlined, SyncOutlined } from "@ant-design/icons";

import { AI_PROVIDER_LABELS } from "@/shared/types/ai";
import type { AiProvider, AiProviderKey } from "@/shared/types/ai";
import { formatDate } from "@/shared/utils/date";

import styles from "./ai-providers.module.scss";

const { Text } = Typography;

interface ProviderKeyCardProps {
  provider: AiProvider;
  apiKey: AiProviderKey | undefined;
  busy: boolean;
  onAdd: (provider: AiProvider) => void;
  onDelete: (provider: AiProvider) => void;
  onValidate: (provider: AiProvider) => void;
}

export const ProviderKeyCard: FC<ProviderKeyCardProps> = ({
  provider,
  apiKey,
  busy,
  onAdd,
  onDelete,
  onValidate,
}) => {
  const label = AI_PROVIDER_LABELS[provider];
  const isConfigured = apiKey !== undefined;

  return (
    <Card className={styles.providerCard} size="small">
      <div className={styles.providerHeader}>
        <div className={styles.providerIdentity}>
          <KeyOutlined className={styles.providerIcon} aria-hidden="true" />
          <div>
            <Text className={styles.providerName}>{label}</Text>
            {isConfigured ? (
              <Space size={4} className={styles.providerStatus}>
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Configured
                </Tag>
                {/* The mask is all the API returns — there is no way to reveal the key. */}
                <Text code aria-label={`${label} key ending ${apiKey.maskedKey}`}>
                  {apiKey.maskedKey}
                </Text>
              </Space>
            ) : (
              <Text type="secondary" className={styles.providerStatus}>
                Not configured
              </Text>
            )}
          </div>
        </div>

        <Space wrap>
          {isConfigured && (
            <Button
              icon={<SyncOutlined />}
              onClick={() => onValidate(provider)}
              disabled={busy}
              aria-label={`Test the ${label} API key`}
            >
              Test
            </Button>
          )}
          <Button
            type={isConfigured ? "default" : "primary"}
            onClick={() => onAdd(provider)}
            disabled={busy}
            aria-label={isConfigured ? `Replace the ${label} API key` : `Add a ${label} API key`}
          >
            {isConfigured ? "Replace" : "Add key"}
          </Button>
          {isConfigured && (
            <Popconfirm
              title={`Delete ${label} API key?`}
              description="Future refinements will use platform credits or other configured providers."
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={() => onDelete(provider)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={busy}
                aria-label={`Delete the ${label} API key`}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      {isConfigured && (
        <Text type="secondary" className={styles.providerMeta}>
          Added {formatDate(apiKey.configuredAt)}
          {apiKey.lastValidatedAt ? ` · Last verified ${formatDate(apiKey.lastValidatedAt)}` : ""}
        </Text>
      )}
    </Card>
  );
};
