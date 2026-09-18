import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/store";
import { adminAuthReducer } from "@/features/auth/state/admin-auth-slice";
import { baseApi } from "@/app/api/base-api";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: any;
}

/**
 * Default test store: auth slice + the RTK Query API slice, so any
 * component/hook using useDispatch, useSelector, or an RTK Query hook
 * (e.g. useCreateProjectMutation) has a real store to talk to.
 */
export function createTestStore(preloadedState: Partial<RootState> = {}) {
  return configureStore({
    reducer: {
      auth: adminAuthReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    middleware: (getDefaultMiddleware) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getDefaultMiddleware().concat(baseApi.middleware as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preloadedState: preloadedState as any,
  });
}

/**
 * Provider + Router wrapper, usable directly as the `wrapper` option for
 * `renderHook` (renderWithProviders below covers plain `render` calls).
 */
export function TestProviders({
  children,
  store = createTestStore(),
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: any;
}) {
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
}

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of the default render from @testing-library/react
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <TestProviders store={store}>{children}</TestProviders>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { renderWithProviders as render };
