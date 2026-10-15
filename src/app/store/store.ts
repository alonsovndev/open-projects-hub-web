import { combineReducers, configureStore, isPending, type Middleware } from "@reduxjs/toolkit";
import { baseApi } from "@/app/api/base-api";
import {
  adminAuthReducer,
  clearAdminSessionState,
  initialAuthState,
  type AdminAuthState,
} from "@/features/auth/state/admin-auth-slice";
import { notifySessionChange } from "@/features/auth/model/session-coordinator";
import { markSignInPending } from "@/features/auth/model/sign-out-intent";
import { isDev } from "@/config/env";

const rootReducer = combineReducers({
  auth: adminAuthReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export interface AppPreloadedState {
  auth?: Partial<AdminAuthState>;
}

const sessionIsolation: Middleware<object, RootState> =
  ({ getState, dispatch }) =>
  (next) =>
  (action) => {
    if (
      isPending(action) &&
      action.type.startsWith(`${baseApi.reducerPath}/`) &&
      typeof action.meta.arg === "object" &&
      action.meta.arg !== null &&
      "endpointName" in action.meta.arg &&
      action.meta.arg.endpointName === "login"
    ) {
      // Reset before the mutation enters the cache so failed login state survives.
      dispatch(clearAdminSessionState());
      markSignInPending();
      notifySessionChange();
    }
    const generation = getState().auth.generation;
    const result = next(action);
    if (getState().auth.generation !== generation) dispatch(baseApi.util.resetApiState());
    return result;
  };

export const createAppStore = (preloadedState: AppPreloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: { auth: { ...initialAuthState, ...preloadedState.auth } },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sessionIsolation, baseApi.middleware),
    devTools: isDev,
  });
export const store = createAppStore();
export type AppDispatch = typeof store.dispatch;
