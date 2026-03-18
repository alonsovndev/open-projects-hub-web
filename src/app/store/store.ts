import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/app/api/base-api";
import { adminAuthReducer } from "@/features/auth/state/admin-auth-slice";

export const store = configureStore({
  reducer: {
    auth: adminAuthReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(baseApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
