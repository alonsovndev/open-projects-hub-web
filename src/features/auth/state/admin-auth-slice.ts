import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminSession } from "@/features/auth/types";

export interface AdminAuthState {
  session: AdminSession | null;
  isBootstrapping: boolean;
  generation: number;
}
export const initialAuthState: AdminAuthState = {
  session: null,
  isBootstrapping: true,
  generation: 0,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: initialAuthState,
  reducers: {
    setAdminSession(state, action: PayloadAction<{ session: AdminSession; rememberMe?: boolean }>) {
      state.session = action.payload.session;
      state.isBootstrapping = false;
      state.generation = (state.generation ?? 0) + 1;
    },
    sessionRefreshed(state, action: PayloadAction<{ session: AdminSession; generation: number }>) {
      if ((state.generation ?? 0) !== action.payload.generation) return;
      state.session = action.payload.session;
      state.isBootstrapping = false;
    },
    workspaceUpdated(state, action: PayloadAction<NonNullable<AdminSession["workspace"]>>) {
      if (state.session) state.session.workspace = action.payload;
    },
    clearAdminSessionState(state) {
      state.session = null;
      state.isBootstrapping = false;
      state.generation = (state.generation ?? 0) + 1;
    },
    sessionBootstrapFinished(state, action: PayloadAction<number | undefined>) {
      if (action.payload !== undefined && (state.generation ?? 0) !== action.payload) return;
      state.isBootstrapping = false;
    },
  },
});

export const {
  setAdminSession,
  sessionRefreshed,
  workspaceUpdated,
  clearAdminSessionState,
  sessionBootstrapFinished,
} = adminAuthSlice.actions;
export const adminAuthReducer = adminAuthSlice.reducer;
