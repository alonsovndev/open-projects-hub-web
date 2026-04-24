import { configureStore } from "@reduxjs/toolkit";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

/**
 * Helper to set up a Redux store for testing RTK Query APIs
 */
export function setupApiStore<A extends BaseQueryFn>(
  api: { reducerPath: string; reducer: any; middleware: any },
  extraReducers?: Record<string, any>
) {
  const getStore = () =>
    configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
        ...extraReducers,
      },
      middleware: (gdm) => gdm().concat(api.middleware),
    });

  const initialStore = getStore();
  const refObj = {
    api,
    store: initialStore,
    refetch: () => {
      refObj.store = getStore();
    },
  };

  return refObj;
}
