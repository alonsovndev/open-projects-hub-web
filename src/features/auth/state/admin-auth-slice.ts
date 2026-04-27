import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AdminSession } from "@/features/auth/types";
import { sessionStorage } from "@/features/auth/model/session-storage";

interface AdminAuthState {
  session: AdminSession | null;
}

const loadInitialSession = (): AdminSession | null => {
  return sessionStorage.load();
};

const initialState: AdminAuthState = {
  session: loadInitialSession(),
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminSession(state, action: PayloadAction<AdminSession>) {
      state.session = action.payload;
      sessionStorage.save(action.payload);
    },
    clearAdminSessionState(state) {
      state.session = null;
      sessionStorage.clear();
    },
  },
});

export const { setAdminSession, clearAdminSessionState } = adminAuthSlice.actions;
export const adminAuthReducer = adminAuthSlice.reducer;
