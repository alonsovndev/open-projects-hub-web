import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { normalizeApiError } from "@/shared/utils/error-messages";
import { adminAuthConfig } from "@/resources/config/auth";
import { applyRefreshedSession } from "@/features/auth/model/apply-refreshed-session";
import {
  mapAdminSession,
  type AdminLoginApiResponse,
} from "@/features/auth/model/map-admin-session";
import { clearAdminSessionState, sessionRefreshed } from "@/features/auth/state/admin-auth-slice";
import {
  notifySessionChange,
  readSessionRevision,
  serializeSessionOperation,
} from "@/features/auth/model/session-coordinator";
import type { AppDispatch, RootState } from "@/app/store/store";
import {
  clearSignOutIntent,
  hasPendingRevocation,
  markSignedOut,
} from "@/features/auth/model/sign-out-intent";

const urlOf = (args: string | FetchArgs) => (typeof args === "string" ? args : args.url);
const isPublicRequest = (args: string | FetchArgs) => urlOf(args).startsWith("/v1/viewer/");
const sessionEndpoints = [
  adminAuthConfig.loginEndpoint,
  adminAuthConfig.refreshEndpoint,
  adminAuthConfig.logoutEndpoint,
] as readonly string[];
const rawBaseQuery = fetchBaseQuery({
  baseUrl: adminAuthConfig.apiBaseUrl,
  credentials: "omit",
  prepareHeaders: (headers, { getState, arg }) => {
    headers.set("Content-Type", "application/json");
    if (!isPublicRequest(arg) && !sessionEndpoints.includes(urlOf(arg))) {
      const token = (getState() as RootState).auth.session?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

type SessionScope = { generation: number; revision: string | null };
const captureScope = (api: BaseQueryApi): SessionScope => ({
  generation: (api.getState() as RootState).auth.generation ?? 0,
  revision: readSessionRevision(),
});
const isCurrent = (api: BaseQueryApi, scope: SessionScope) =>
  captureScope(api).generation === scope.generation && readSessionRevision() === scope.revision;
const staleResult = (): { error: FetchBaseQueryError } => ({
  error: {
    status: "CUSTOM_ERROR",
    error: "Your session changed. Please try again.",
    data: { message: "Your session changed. Please try again." },
  },
});
const cookieRequest = (args: string | FetchArgs): FetchArgs => ({
  ...(typeof args === "string" ? { url: args } : args),
  credentials: "include",
  headers: { "X-Session-Mode": "cookie" },
});
type QueryResult = Awaited<ReturnType<typeof rawBaseQuery>>;
const sessionQuery = (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) =>
  // Cache reset must not release the cookie lock while the browser can still
  // install Set-Cookie from the server's in-flight response.
  rawBaseQuery(cookieRequest(args), { ...api, signal: new AbortController().signal }, extraOptions);
const refreshes = new WeakMap<
  BaseQueryApi["getState"],
  { generation: number; revision: string | null; promise: Promise<QueryResult> }
>();

const refreshSession = (api: BaseQueryApi, extraOptions: object): Promise<QueryResult> => {
  const scope = captureScope(api);
  const existing = refreshes.get(api.getState);
  if (existing?.generation === scope.generation && existing.revision === scope.revision)
    return existing.promise;
  const promise = serializeSessionOperation(async (): Promise<QueryResult> => {
    if (!isCurrent(api, scope)) return staleResult();
    const result = await sessionQuery(
      { url: adminAuthConfig.refreshEndpoint, method: "POST" },
      api,
      extraOptions
    );
    if (!isCurrent(api, scope)) return staleResult();
    if (result.data) {
      try {
        applyRefreshedSession(
          api.dispatch as AppDispatch,
          result.data as AdminLoginApiResponse,
          scope.generation
        );
      } catch {
        return {
          error: {
            status: "CUSTOM_ERROR",
            error: "Invalid session response.",
            data: { message: "We couldn't resume your session. Please sign in again." },
          },
        };
      }
    } else if (result.error?.status === 401) {
      markSignedOut();
      api.dispatch(clearAdminSessionState());
      notifySessionChange();
    }
    return result;
  });
  refreshes.set(api.getState, { ...scope, promise });
  void promise
    .finally(() => {
      if (refreshes.get(api.getState)?.promise === promise) refreshes.delete(api.getState);
    })
    .catch(() => undefined);
  return promise;
};

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const url = urlOf(args);
  let result: QueryResult;
  if (url === adminAuthConfig.refreshEndpoint) {
    result = await refreshSession(api, extraOptions);
  } else if (url === adminAuthConfig.logoutEndpoint) {
    // Set-Cookie is applied by the browser even if JS ignores a stale response. Drain
    // previous refreshes before the server deletes and revokes the current cookie.
    result = await serializeSessionOperation(async () => {
      const retryPending =
        typeof args === "object" && "onlyIfSignedOut" in args && args.onlyIfSignedOut === true;
      if (retryPending && !hasPendingRevocation()) return { data: { message: "Signed out." } };
      return await sessionQuery(args, api, extraOptions);
    });
  } else if (url === adminAuthConfig.loginEndpoint) {
    const scope = captureScope(api);
    result = await serializeSessionOperation(async () => {
      if (!isCurrent(api, scope)) return staleResult();
      const loginResult = await sessionQuery(args, api, extraOptions);
      if (!isCurrent(api, scope)) return staleResult();
      if (loginResult.data) {
        try {
          const credentials =
            typeof args === "object" ? (args.body as { email?: string }) : undefined;
          api.dispatch(
            sessionRefreshed({
              generation: scope.generation,
              session: mapAdminSession(
                loginResult.data as AdminLoginApiResponse,
                credentials?.email ?? ""
              ),
            })
          );
          clearSignOutIntent();
        } catch {
          markSignedOut();
          return {
            error: {
              status: "CUSTOM_ERROR" as const,
              error: "Invalid session response.",
              data: { message: "We couldn't sign you in. Please try again." },
            },
          };
        }
      }
      if (loginResult.error) markSignedOut();
      return loginResult;
    });
  } else {
    const scope = captureScope(api);
    result = await rawBaseQuery(args, api, extraOptions);
    if (!isPublicRequest(args) && !isCurrent(api, scope)) return staleResult();
    if (
      result.error?.status === 401 &&
      !isPublicRequest(args) &&
      (api.getState() as RootState).auth.session
    ) {
      const refreshResult = await refreshSession(api, extraOptions);
      if (!isCurrent(api, scope)) return staleResult();
      if (refreshResult.data) {
        result = await rawBaseQuery(args, api, extraOptions);
        if (!isCurrent(api, scope)) return staleResult();
        if (result.error?.status === 401) {
          markSignedOut();
          api.dispatch(clearAdminSessionState());
          notifySessionChange();
          void serializeSessionOperation(
            async () =>
              await sessionQuery(
                { url: adminAuthConfig.logoutEndpoint, method: "POST" },
                api,
                extraOptions
              )
          );
        }
      }
    }
  }
  return result.error ? { error: normalizeApiError(result.error, url) } : result;
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
