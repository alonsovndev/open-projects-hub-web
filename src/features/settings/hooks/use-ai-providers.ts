import { useCallback, useMemo } from "react";
import { message } from "antd";

import {
  useDeleteApiKeyMutation,
  useGetApiKeysQuery,
  useGetCreditBalanceQuery,
  useSaveApiKeyMutation,
  useValidateApiKeyMutation,
} from "@/features/settings/api/ai-providers-api";
import { AI_PROVIDER_LABELS, AI_PROVIDERS } from "@/shared/types/ai";
import type { AiProvider, AiProviderKey } from "@/shared/types/ai";
import { getErrorMessage } from "@/shared/types/api";

export const useAiProviders = () => {
  const { data: keys, isLoading: keysLoading, error: keysError } = useGetApiKeysQuery();
  const { data: balance, isLoading: balanceLoading } = useGetCreditBalanceQuery();

  const [saveKey, { isLoading: isSaving }] = useSaveApiKeyMutation();
  const [deleteKey, { isLoading: isDeleting }] = useDeleteApiKeyMutation();
  const [validateKey, { isLoading: isValidating }] = useValidateApiKeyMutation();

  // Indexed by provider so each card can look its own key up without rescanning the list.
  const keysByProvider = useMemo(() => {
    const index = {} as Partial<Record<AiProvider, AiProviderKey>>;
    for (const key of keys ?? []) {
      index[key.provider] = key;
    }
    return index;
  }, [keys]);

  const handleSaveKey = useCallback(
    async (provider: AiProvider, apiKey: string) => {
      try {
        await saveKey({ provider, apiKey }).unwrap();
        message.success("API key saved.");
      } catch (err) {
        message.error(
          getErrorMessage(
            err,
            `We couldn't save your ${AI_PROVIDER_LABELS[provider]} key. Please try again.`
          )
        );
        throw err;
      }
    },
    [saveKey]
  );

  const handleDeleteKey = useCallback(
    async (provider: AiProvider) => {
      try {
        await deleteKey(provider).unwrap();
        message.success(`${AI_PROVIDER_LABELS[provider]} API key deleted.`);
      } catch (err) {
        message.error(
          getErrorMessage(
            err,
            `We couldn't delete your ${AI_PROVIDER_LABELS[provider]} key. Please try again.`
          )
        );
        throw err;
      }
    },
    [deleteKey]
  );

  const handleValidateKey = useCallback(
    async (provider: AiProvider) => {
      try {
        const result = await validateKey(provider).unwrap();
        if (result.quotaWarning) {
          message.warning(
            `Your ${AI_PROVIDER_LABELS[provider]} quota is running low. ` +
              "Consider upgrading your plan or adding another provider."
          );
        } else {
          message.success(`${AI_PROVIDER_LABELS[provider]} API key is valid.`);
        }
        return result;
      } catch (err) {
        message.error(
          getErrorMessage(
            err,
            `We couldn't check your ${AI_PROVIDER_LABELS[provider]} key. Please try again.`
          )
        );
        throw err;
      }
    },
    [validateKey]
  );

  return {
    providers: AI_PROVIDERS,
    keysByProvider,
    balance: balance ?? null,
    loading: keysLoading || balanceLoading,
    error: keysError,
    saving: isSaving,
    deleting: isDeleting,
    validating: isValidating,
    handleSaveKey,
    handleDeleteKey,
    handleValidateKey,
  };
};
