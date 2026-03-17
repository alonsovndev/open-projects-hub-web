import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AdminSession } from "@/features/admin-auth/types";

interface AdminAuthState {
  session: AdminSession | null;
}

const initialState: AdminAuthState = {
  session: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminSession(state, action: PayloadAction<AdminSession>) {
      state.session = action.payload;
    },
    clearAdminSessionState(state) {
      state.session = null;
    },
  },
});

export const { setAdminSession, clearAdminSessionState } = adminAuthSlice.actions;
export const adminAuthReducer = adminAuthSlice.reducer;
