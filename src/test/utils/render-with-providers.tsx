import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createAppStore, type AppPreloadedState } from "@/app/store/store";
import { ThemeProvider } from "@/app/theme/theme-provider";

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: AppPreloadedState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store?: any;
}

/**
 * Default test store: auth slice + the RTK Query API slice, so any
 * component/hook using useDispatch, useSelector, or an RTK Query hook
 * (e.g. useCreateProjectMutation) has a real store to talk to.
 */
export function createTestStore(preloadedState: AppPreloadedState = {}) {
  return createAppStore(preloadedState);
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
      <BrowserRouter>
        <ThemeProvider>{children}</ThemeProvider>
      </BrowserRouter>
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
