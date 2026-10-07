import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

import { adminAuthConfig } from "@/resources/config/auth";
import { applyRefreshedSession } from "@/features/auth/model/apply-refreshed-session";
import { clearAdminSessionState } from "@/features/auth/state/admin-auth-slice";
import type { AppDispatch, RootState } from "@/app/store/store";

/** The error shapes this API returns: a FastAPI `detail`, plus any handler-specific fields. */
interface ApiErrorBody {
  detail?: string;
  message?: string;
  code?: string;
  provider?: string;
  reason?: string;
  promptsKeyUpdate?: boolean;
}

/**
 * The Client Review route is anonymous: its access code is the only credential. A freelancer
 * previewing it while signed in must be treated like any other visitor, so these calls carry
 * no token and a 404 or 429 from them never touches the freelancer's session.
 */
const PUBLIC_URL_PREFIX = "/v1/viewer/";

const isPublicRequest = (args: string | FetchArgs): boolean =>
  (typeof args === "string" ? args : args.url).startsWith(PUBLIC_URL_PREFIX);

const rawBaseQuery = fetchBaseQuery({
  baseUrl: adminAuthConfig.apiBaseUrl,
  prepareHeaders: (headers, { getState, arg }) => {
    headers.set("Content-Type", "application/json");

    if (isPublicRequest(arg)) {
      return headers;
    }

    // Read token from Redux state (in-memory only)
    const state = getState() as RootState;
    const token = state.auth.session?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Access tokens are short-lived (15 min) by design, so a 401 mid-session is
// expected routine behavior, not a sign the session is over — the refresh
// token (and sessionExpiresAt) can still be well within its 24h/7d window.
// Shared across concurrent requests so a burst of parallel queries doesn't
// each kick off their own refresh call.
let refreshPromise: Promise<boolean> | null = null;

const refreshSession = (api: BaseQueryApi): Promise<boolean> => {
  refreshPromise ??= (async () => {
    const session = (api.getState() as RootState).auth.session;
    if (!session?.refreshToken) return false;

    const refreshResult = await rawBaseQuery(
      { url: adminAuthConfig.refreshEndpoint, method: "POST", body: { refreshToken: session.refreshToken } },
      api,
      {}
    );

    if (refreshResult.error || !refreshResult.data) return false;

    applyRefreshedSession(
      api.dispatch as AppDispatch,
      session,
      refreshResult.data as { accessToken: string; refreshToken: string; sessionExpiresAt?: string }
    );
    return true;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

// FetchBaseQueryMeta is declared so endpoints can read response headers in
// transformResponse — the export endpoint takes its filename from Content-Disposition.
export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isPublicRequest(args)) {
    const isRefreshCall = typeof args === "object" && args.url === adminAuthConfig.refreshEndpoint;
    const hadSession = (api.getState() as RootState).auth.session?.token != null;

    if (hadSession && !isRefreshCall) {
      // Try a silent refresh once, then retry the original request with the new token.
      const refreshed = await refreshSession(api);
      result = refreshed ? await rawBaseQuery(args, api, extraOptions) : result;
      if (!refreshed) {
        api.dispatch(clearAdminSessionState());
      }
    } else if (hadSession) {
      // The refresh call itself came back 401 — the refresh token is dead too.
      api.dispatch(clearAdminSessionState());
    }
  }

  if (result.error) {
    // Log full error for debugging
    console.error("[baseQuery] Error occurred:", {
      status: result.error.status,
      statusType: typeof result.error.status,
      data: result.error.data,
      error: "error" in result.error ? result.error.error : undefined,
      originalStatus: "originalStatus" in result.error ? result.error.originalStatus : undefined,
      fullError: JSON.stringify(result.error, null, 2),
    });

    // FastAPI (and this app's exception handlers) return errors as { detail: "..." },
    // not { message: "..." } — read detail first, falling back to message for resilience.
    const errorData = result.error.data as ApiErrorBody | undefined;
    const normalizedMessage =
      errorData?.detail ?? errorData?.message ?? "Something went wrong while communicating with the API.";

    // Some handlers attach fields the caller must act on rather than just display — the
    // provider-key errors carry `promptsKeyUpdate`, which decides whether the user is
    // sent to Settings (F-010 FR-010-11). Normalizing to `message` alone would drop them.
    const structured = {
      ...(errorData?.code !== undefined && { code: errorData.code }),
      ...(errorData?.provider !== undefined && { provider: errorData.provider }),
      ...(errorData?.reason !== undefined && { reason: errorData.reason }),
      ...(errorData?.promptsKeyUpdate !== undefined && { promptsKeyUpdate: errorData.promptsKeyUpdate }),
    };

    if (typeof result.error.status === "number") {
      return {
        error: {
          status: result.error.status,
          data: {
            message: normalizedMessage,
            ...structured,
          },
        },
      };
    }

    return {
      error: {
        status: "CUSTOM_ERROR",
        error: normalizedMessage,
        data: {
          message: normalizedMessage,
          ...structured,
        },
      },
    };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: [
    "AdminAuth",
    "Projects",
    "Clients",
    "DashboardStats",
    "Stories",
    "Backlog",
    "UserProfile",
    "AiProviderKeys",
    "CreditBalance",
    "TeamMembers",
  ],
  endpoints: () => ({}),
});
