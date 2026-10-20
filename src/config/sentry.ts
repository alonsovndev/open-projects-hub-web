import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import { env, mode } from "@/config/env";

export function initSentry(): void {
  if (!env.VITE_SENTRY_DSN) return;

  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: mode,
    // Mirrors the API's send_default_pii=False; SDK v11 defaults to collecting all of these.
    // Query params are off because the verify-email and reset-password pages carry the email and code in the URL.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
    },
    integrations: [
      Sentry.reactRouterBrowserTracingIntegration({
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    tracesSampleRate: 0.1,
    // No trace headers on outgoing requests: the API CORS allow_headers does not include sentry-trace/baggage,
    // so propagating them cross-origin would make the browser block every API call.
    tracePropagationTargets: [],
  });
}
