import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AdminSession } from "@/features/auth/types";
import { sessionStorage } from "@/features/auth/model/session-storage";

interface AdminAuthState {
  session: AdminSession | null;
}

const loadInitialSession = (): AdminSession | null => {
  // Token is not persisted in localStorage for security
  // User must re-authenticate on page reload
  return null;
};

const initialState: AdminAuthState = {
  session: loadInitialSession(),
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminSession(state, action: PayloadAction<{ session: AdminSession; rememberMe?: boolean }>) {
      state.session = action.payload.session;
      sessionStorage.save(action.payload.session, action.payload.rememberMe);
    },
    clearAdminSessionState(state) {
      state.session = null;
      sessionStorage.clear();
    },
  },
});

export const { setAdminSession, clearAdminSessionState } = adminAuthSlice.actions;
export const adminAuthReducer = adminAuthSlice.reducer;
