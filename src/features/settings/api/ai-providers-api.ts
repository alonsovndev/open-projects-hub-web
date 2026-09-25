import { baseApi } from "@/app/api/base-api";

import type {
  AiProvider,
  AiProviderKey,
  CreditBalance,
  SaveApiKeyPayload,
  ValidateApiKeyResult,
} from "@/shared/types/ai";

interface ListApiKeysResponse {
  keys: AiProviderKey[];
}

// Saving, deleting, or validating a key changes what the refinement provider selector may
// offer, and the zero-credit prompt depends on the balance — so key mutations invalidate
// both tags even though they only write one of them.
const KEY_MUTATION_TAGS = ["AiProviderKeys", "CreditBalance"] as const;

export const aiProvidersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCreditBalance: builder.query<CreditBalance, void>({
      query: () => "/v1/users/me/credits",
      providesTags: ["CreditBalance"],
    }),

    getApiKeys: builder.query<AiProviderKey[], void>({
      query: () => "/v1/users/me/api-keys",
      transformResponse: (response: ListApiKeysResponse) => response.keys,
      providesTags: ["AiProviderKeys"],
    }),

    // Also the rotation path: posting again for a provider replaces the stored key.
    saveApiKey: builder.mutation<AiProviderKey, SaveApiKeyPayload>({
      query: (payload) => ({
        url: "/v1/users/me/api-keys",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [...KEY_MUTATION_TAGS],
    }),

    deleteApiKey: builder.mutation<void, AiProvider>({
      query: (provider) => ({
        url: `/v1/users/me/api-keys/${provider}`,
        method: "DELETE",
      }),
      invalidatesTags: [...KEY_MUTATION_TAGS],
    }),

    validateApiKey: builder.mutation<ValidateApiKeyResult, AiProvider>({
      query: (provider) => ({
        url: `/v1/users/me/api-keys/${provider}/validate`,
        method: "POST",
      }),
      // A successful validation refreshes lastValidatedAt on the stored key.
      invalidatesTags: ["AiProviderKeys"],
    }),
  }),
});

export const {
  useGetCreditBalanceQuery,
  useGetApiKeysQuery,
  useSaveApiKeyMutation,
  useDeleteApiKeyMutation,
  useValidateApiKeyMutation,
} = aiProvidersApi;
