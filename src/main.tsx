import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import { initializeTheme } from "@/app/theme/theme-provider";
import { initSentry } from "@/config/sentry";

import "@/styles/global.scss";

initSentry();
initializeTheme();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
