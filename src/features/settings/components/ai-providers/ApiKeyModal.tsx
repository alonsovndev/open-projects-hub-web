import { useEffect } from "react";
import type { FC } from "react";
import { Alert, Form, Input, Modal, Typography } from "antd";

import { AI_PROVIDER_CONSOLE_URLS, AI_PROVIDER_LABELS } from "@/shared/types/ai";
import type { AiProvider } from "@/shared/types/ai";

const { Text, Link } = Typography;

interface ApiKeyModalProps {
  provider: AiProvider | null;
  /** True when the provider already has a key, so this save will replace it. */
  isReplacing: boolean;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (provider: AiProvider, apiKey: string) => Promise<void>;
}

interface ApiKeyFormValues {
  apiKey: string;
}

export const ApiKeyModal: FC<ApiKeyModalProps> = ({
  provider,
  isReplacing,
  saving,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<ApiKeyFormValues>();

  useEffect(() => {
    if (provider) {
      form.resetFields();
    }
  }, [provider, form]);

  if (!provider) return null;

  const label = AI_PROVIDER_LABELS[provider];

  const handleOk = async () => {
    const values = await form.validateFields();
    try {
      await onSubmit(provider, values.apiKey.trim());
      onCancel();
    } catch {
      // The hook has already surfaced the provider's message; keep the modal open so the
      // user can correct the key rather than retyping it from scratch.
    }
  };

  return (
    <Modal
      open
      title={isReplacing ? `Replace ${label} API key` : `Add ${label} API key`}
      okText={isReplacing ? "Replace key" : "Save key"}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={saving}
      destroyOnHidden
    >
      {isReplacing && (
        <Alert
          type="warning"
          showIcon
          className="api-key-modal-alert"
          message="Your current key will stop working"
          description={`Saving replaces the ${label} key already stored. The old key is discarded immediately.`}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label={`${label} API key`}
          name="apiKey"
          rules={[
            { required: true, message: `Enter your ${label} API key` },
            { min: 20, message: "That key looks too short — check you copied all of it" },
            {
              // Pasting from a console often drags in a newline or a stray space, which the
              // provider would reject; catching it here saves a validation attempt.
              pattern: /^\S+$/,
              message: "The key must not contain spaces or line breaks",
            },
          ]}
          extra={
            <Text type="secondary">
              Get a key from the{" "}
              <Link href={AI_PROVIDER_CONSOLE_URLS[provider]} target="_blank" rel="noreferrer">
                {label} console
              </Link>
              . We store it encrypted and never show it again.
            </Text>
          }
        >
          {/* Password input: the key must not sit in plain sight, and there is no
              retrieval endpoint, so this is the only moment it is ever on screen. */}
          <Input.Password size="large" placeholder={`Paste your ${label} key`} autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
