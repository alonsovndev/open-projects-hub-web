import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { ERROR_MESSAGES, errorBody, isApprovedErrorMessage } from "@/shared/utils/error-messages";

export interface ApiError {
  status: FetchBaseQueryError["status"];
  data: {
    message: string;
    code?: string;
  };
}

export function isApiError(error: unknown): error is ApiError {
  const failure = errorBody(error);
  const body = errorBody(failure.data);
  return (
    (typeof failure.status === "number" ||
      ["FETCH_ERROR", "TIMEOUT_ERROR", "PARSING_ERROR", "CUSTOM_ERROR"].includes(
        failure.status as string
      )) &&
    typeof body.message === "string"
  );
}

/** Unknown exception text is never safe to display, including JavaScript Error messages. */
export function getErrorMessage(
  error: unknown,
  fallback: string = ERROR_MESSAGES.unexpected
): string {
  const failure = errorBody(error);
  if (failure.status === "FETCH_ERROR") return ERROR_MESSAGES.connection;
  if (failure.status === "TIMEOUT_ERROR") return ERROR_MESSAGES.timeout;
  const message = errorBody(failure.data).message;
  if (isApprovedErrorMessage(message) && message !== ERROR_MESSAGES.unexpected) return message;
  if (failure.status === 403) return ERROR_MESSAGES.permission;
  if (failure.status === 429) return ERROR_MESSAGES.rateLimit;
  if (failure.status === 422) return ERROR_MESSAGES.validation;
  return fallback;
}
