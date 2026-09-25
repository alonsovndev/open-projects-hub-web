/**
 * AI credit and provider-key types shared by the settings and refinement features
 * (F-010). Kept here rather than in either feature because both read them.
 */

/** A provider the user can hold their own API key for. */
export type AiProvider = "gemini" | "openai" | "deepseek";

/** What a single refinement run is billed against. */
export type RefinementProvider = "platform" | AiProvider;

export const AI_PROVIDERS: readonly AiProvider[] = ["gemini", "openai", "deepseek"] as const;

/** Provider names as written in the UI. */
export const AI_PROVIDER_LABELS: Record<AiProvider, string> = {
  gemini: "Gemini",
  openai: "OpenAI",
  deepseek: "DeepSeek",
};

export const REFINEMENT_PROVIDER_LABELS: Record<RefinementProvider, string> = {
  platform: "Platform",
  ...AI_PROVIDER_LABELS,
};

/** Where to obtain each provider's key, shown as help text on the key form. */
export const AI_PROVIDER_CONSOLE_URLS: Record<AiProvider, string> = {
  gemini: "https://aistudio.google.com/apikey",
  openai: "https://platform.openai.com/api-keys",
  deepseek: "https://platform.deepseek.com/api_keys",
};

/**
 * A configured provider key, as the API describes it.
 *
 * There is no field for the key itself: the backend exposes no plaintext read path,
 * so `maskedKey` is all the UI ever has (FR-010-07).
 */
export interface AiProviderKey {
  provider: AiProvider;
  maskedKey: string;
  configuredAt: string;
  lastValidatedAt: string | null;
}

/** Remaining and originally granted free platform refinements. */
export interface CreditBalance {
  credits: number;
  totalGranted: number;
}

export interface SaveApiKeyPayload {
  provider: AiProvider;
  apiKey: string;
}

export interface ValidateApiKeyResult {
  provider: AiProvider;
  valid: boolean;
  /** True when the provider reports quota at or above 80% consumed (FR-010-12). */
  quotaWarning: boolean;
}

/**
 * The structured part of a provider-related API error.
 *
 * `promptsKeyUpdate` distinguishes a bad key, which the user fixes in Settings, from a
 * spent quota or an outage, which they cannot (FR-010-10 vs FR-010-11).
 */
export interface ProviderErrorDetail {
  code?: string;
  provider?: AiProvider;
  reason?: string;
  promptsKeyUpdate?: boolean;
}
