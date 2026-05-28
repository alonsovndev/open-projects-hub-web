import type { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "@/app/routing/AppRouter";
import { store } from "@/app/store/store";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { ThemeProvider } from "@/app/theme/theme-provider";

import "@/styles/animations.scss";

const App: FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <AppRouter />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
