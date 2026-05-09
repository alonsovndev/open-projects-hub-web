import type { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "@/app/routing/AppRouter";
import { store } from "@/app/store/store";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

const App: FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
