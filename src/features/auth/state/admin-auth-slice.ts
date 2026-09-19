import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AdminSession } from "@/features/auth/types";
import { sessionStorage } from "@/features/auth/model/session-storage";

interface AdminAuthState {
  session: AdminSession | null;
  /**
   * True while attempting to resume a persisted session on app boot (see
   * useSessionBootstrap). The access token is never persisted, so a stored
   * session only carries enough (a refresh token) to attempt a silent
   * refresh — until that resolves, callers shouldn't treat `session: null`
   * as "definitely logged out".
   */
  isBootstrapping: boolean;
}

const initialState: AdminAuthState = {
  session: null,
  isBootstrapping: sessionStorage.load()?.refreshToken != null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminSession(state, action: PayloadAction<{ session: AdminSession; rememberMe?: boolean }>) {
      state.session = action.payload.session;
      state.isBootstrapping = false;
      sessionStorage.save(action.payload.session, action.payload.rememberMe);
    },
    clearAdminSessionState(state) {
      state.session = null;
      state.isBootstrapping = false;
      sessionStorage.clear();
    },
    sessionBootstrapFinished(state) {
      state.isBootstrapping = false;
    },
  },
});

export const { setAdminSession, clearAdminSessionState, sessionBootstrapFinished } = adminAuthSlice.actions;
export const adminAuthReducer = adminAuthSlice.reducer;
