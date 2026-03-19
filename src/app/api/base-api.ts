import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { adminAuthConfig } from "@/resources/config/auth";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: adminAuthConfig.apiBaseUrl,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    const session = window.localStorage.getItem(adminAuthConfig.sessionStorageKey);

    if (session) {
      try {
        const parsedSession = JSON.parse(session) as { token?: string };

        if (parsedSession.token) {
          headers.set("Authorization", `Bearer ${parsedSession.token}`);
        }
      } catch {
        window.localStorage.removeItem(adminAuthConfig.sessionStorageKey);
      }
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const errorData = result.error.data as { message?: string } | undefined;
    const normalizedMessage =
      errorData?.message ?? "Something went wrong while communicating with the API.";

    if (typeof result.error.status === "number") {
      return {
        error: {
          status: result.error.status,
          data: {
            message: normalizedMessage,
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
        },
      },
    };
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: ["AdminAuth"],
  endpoints: () => ({}),
});
