import { adminAuthConfig } from "@/resources/config/auth";

import { baseApi } from "@/app/api/base-api";
import type {
  AdminAuthResponse,
  AdminLoginValues,
  AdminRegisterValues,
  ForgotPasswordValues,
  ResetPasswordValues,
  AdminSession,
  UserRole,
} from "@/features/auth/types";

export interface AdminLoginApiResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  sessionExpiresAt?: string;
  email?: string;
  displayName?: string;
  loggedInAt?: string;
  role?: UserRole;
  user?: {
    email?: string;
    displayName?: string;
    name?: string;
    role?: UserRole;
  };
}

interface MessageResponse {
  message: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  sessionExpiresAt?: string;
}

/** forgotPassword and resendResetCode both just POST { email } to their own endpoint. */
const postEmail =
  (endpoint: string) =>
  (data: ForgotPasswordValues): { url: string; method: "POST"; body: ForgotPasswordValues } => ({
    url: endpoint,
    method: "POST",
    body: data,
  });

const getDisplayNameFromEmail = (email: string) => {
  const nameFromEmail = email.split("@")[0] ?? "admin";

  return nameFromEmail.replace(/[._-]+/g, " ");
};

/** Exported for tests: this is the single point at which a role enters the app. */
export const mapAdminSession = (
  response: AdminLoginApiResponse,
  fallbackEmail: string
): AdminSession => {
  const normalizedEmail = (response.user?.email ?? response.email ?? fallbackEmail)
    .trim()
    .toLowerCase();
  const token = response.token ?? response.accessToken;

  if (!token) {
    throw new Error("Authentication response did not include a token.");
  }

  return {
    token,
    refreshToken: response.refreshToken,
    sessionExpiresAt: response.sessionExpiresAt,
    email: normalizedEmail,
    displayName:
      response.user?.displayName ??
      response.user?.name ??
      response.displayName ??
      getDisplayNameFromEmail(normalizedEmail),
    loggedInAt: response.loggedInAt ?? new Date().toISOString(),
    // Every role check in the app reads this one field, so an absent role must fall back
    // to the least privilege rather than the most: a malformed response should cost a
    // viewer nothing, not hand them the admin shell.
    role: response.user?.role ?? response.role ?? "viewer",
  };
};

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AdminAuthResponse, AdminLoginValues>({
      query: (credentials) => ({
        url: adminAuthConfig.loginEndpoint,
        method: "POST",
        body: {
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.remember ?? false,
        },
      }),

      transformResponse: (response: AdminLoginApiResponse, _meta, credentials) => {
        return {
          session: mapAdminSession(response, credentials.email),
        };
      },
      invalidatesTags: ["AdminAuth"],
    }),

    register: builder.mutation<AdminAuthResponse, AdminRegisterValues>({
      query: (userData) => ({
        url: adminAuthConfig.registerEndpoint,
        method: "POST",
        body: {
          displayName: userData.fullName,
          email: userData.email,
          password: userData.password,
        },
      }),
      transformResponse: (response: AdminLoginApiResponse, _meta, credentials) => {
        return {
          session: mapAdminSession(response, credentials.email),
        };
      },
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: adminAuthConfig.refreshEndpoint,
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordValues>({
      query: postEmail(adminAuthConfig.forgotPasswordEndpoint),
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordValues>({
      query: ({ email, code, newPassword }) => ({
        url: adminAuthConfig.resetPasswordEndpoint,
        method: "POST",
        body: { email, code, newPassword },
      }),
    }),

    resendResetCode: builder.mutation<MessageResponse, ForgotPasswordValues>({
      query: postEmail(adminAuthConfig.resendResetCodeEndpoint),
    }),

    logout: builder.mutation<MessageResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: adminAuthConfig.logoutEndpoint,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendResetCodeMutation,
  useLogoutMutation,
} = adminAuthApi;
