import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import { mode } from "@/config/env";

async function enableMocking() {
  if (mode !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
