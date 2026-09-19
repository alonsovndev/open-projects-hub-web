import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";

import "@/styles/global.scss";

async function enableMocking() {
  // Disable MSW to use real backend API
  // To re-enable mocking, uncomment the code below
  return;

  // if (mode !== "development") {
  //   return;
  // }

  // const { worker } = await import("./mocks/browser");
  // return worker.start({
  //   onUnhandledRequest: "bypass",
  // });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
