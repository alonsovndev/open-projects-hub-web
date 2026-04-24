import type { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "@/app/routing/AppRouter";
import { store } from "@/app/store/store";

const App: FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
