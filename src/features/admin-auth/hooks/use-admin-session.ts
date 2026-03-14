import { useState } from "react";

import { clearAdminSession, getAdminSession, saveAdminSession } from "@/features/admin-auth/model/admin-session";
import type { AdminSession } from "@/features/admin-auth/types";

export const useAdminSession = () => {
  const [session, setSession] = useState<AdminSession | null>(() => getAdminSession());

  const storeSession = (nextSession: AdminSession) => {
    saveAdminSession(nextSession);
    setSession(nextSession);
  };

  const removeSession = () => {
    clearAdminSession();
    setSession(null);
  };

  return {
    session,
    isAuthenticated: Boolean(session),
    storeSession,
    removeSession,
  };
};
