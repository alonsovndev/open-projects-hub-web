import type { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "@/app/routing/AppRouter";
import { RouteLoading } from "@/app/routing/RouteLoading";
import { store } from "@/app/store/store";
import { useSessionBootstrap } from "@/features/auth/hooks/use-session-bootstrap";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { ThemeProvider } from "@/app/theme/theme-provider";

import "@/styles/animations.scss";

const AppShell: FC = () => {
  const { isBootstrapping } = useSessionBootstrap();

  if (isBootstrapping) {
    return <RouteLoading message="Resuming your session..." />;
  }

  return <AppRouter />;
};

const App: FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <AppShell />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
