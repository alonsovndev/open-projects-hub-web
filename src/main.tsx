import React from "react";
import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import { initializeTheme } from "@/app/theme/theme-provider";
import { initSentry } from "@/config/sentry";

import "@/styles/global.scss";

initSentry();
initializeTheme();

// onCaughtError is omitted: ErrorBoundary already captures what it catches.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement, {
  onUncaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
