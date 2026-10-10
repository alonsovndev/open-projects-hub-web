import { adminAuthConfig } from "@/resources/config/auth";

import { baseApi } from "@/app/api/base-api";
import type {
  AdminAuthResponse,
  AdminLoginValues,
  AdminRegisterValues,
  ForgotPasswordValues,
  RegisterResult,
  VerifyEmailValues,
  ResetPasswordValues,
} from "@/features/auth/types";

import {
  mapAdminSession,
  type AdminLoginApiResponse,
} from "@/features/auth/model/map-admin-session";
export {
  mapAdminSession,
  type AdminLoginApiResponse,
} from "@/features/auth/model/map-admin-session";

interface MessageResponse {
  message: string;
}

interface RegisterApiResponse {
  email: string;
  verificationRequired: boolean;
  nextStep: string;
  codeExpiresAt: string;
}

/** forgotPassword, resendResetCode and resendVerification all just POST { email } to their own endpoint. */
const postEmail =
  (endpoint: string) =>
  (data: ForgotPasswordValues): { url: string; method: "POST"; body: ForgotPasswordValues } => ({
    url: endpoint,
    method: "POST",
    body: data,
  });

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

    register: builder.mutation<RegisterResult, AdminRegisterValues>({
      query: (userData) => ({
        url: adminAuthConfig.registerEndpoint,
        method: "POST",
        body: {
          displayName: userData.fullName,
          email: userData.email,
          password: userData.password,
          ...(userData.workspaceName?.trim()
            ? { workspaceName: userData.workspaceName.trim() }
            : {}),
        },
      }),
      transformResponse: (response: RegisterApiResponse): RegisterResult => ({
        codeExpiresAt: response.codeExpiresAt,
      }),
    }),

    verifyEmail: builder.mutation<{ verified: boolean }, VerifyEmailValues>({
      query: ({ email, code, password }) => ({
        url: adminAuthConfig.verifyEmailEndpoint,
        method: "POST",
        body: { email, code, password },
      }),
    }),

    resendVerification: builder.mutation<MessageResponse, ForgotPasswordValues>({
      query: postEmail(adminAuthConfig.resendVerificationEndpoint),
    }),

    refreshToken: builder.mutation<AdminLoginApiResponse, void>({
      query: () => ({ url: adminAuthConfig.refreshEndpoint, method: "POST" }),
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

    logout: builder.mutation<MessageResponse, void | { retryPending: true }>({
      query: (options) => ({
        url: adminAuthConfig.logoutEndpoint,
        method: "POST",
        onlyIfSignedOut: options?.retryPending === true,
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
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLogoutMutation,
} = adminAuthApi;
