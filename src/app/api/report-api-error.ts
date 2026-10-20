import * as Sentry from "@sentry/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const invalidSessionResponseMessage = "Invalid session response.";

const identifierSegment = /^(\d+|[0-9a-f]{8}-[0-9a-f-]{27}|[0-9a-f]{16,})$/i;

// Path template only: query strings and identifiers can carry user data.
const endpointTemplate = (url: string) =>
  url
    .split("?")[0]
    .split("/")
    .map((segment) => (identifierSegment.test(segment) ? ":id" : segment))
    .join("/");

const isReportable = (error: FetchBaseQueryError): boolean => {
  if (typeof error.status === "number") return error.status >= 500;
  if (error.status === "FETCH_ERROR") return !error.error.startsWith("AbortError");
  if (error.status === "PARSING_ERROR") return true;
  return error.status === "CUSTOM_ERROR" && error.error === invalidSessionResponseMessage;
};

/** Reports unexpected API failures with classification only; never bodies, headers or query strings. */
export function reportApiError(error: FetchBaseQueryError, url: string): void {
  if (!isReportable(error)) return;
  const endpoint = endpointTemplate(url);
  const status = String(error.status);
  Sentry.captureMessage("API request failed", {
    level: "error",
    tags: { endpoint, status },
    fingerprint: ["api-request-failed", endpoint, status],
  });
}
