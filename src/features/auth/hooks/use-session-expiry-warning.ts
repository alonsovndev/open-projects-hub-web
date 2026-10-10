import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useLogoutMutation, useRefreshTokenMutation } from "@/features/auth/api/admin-auth-api";
import { clearAdminSessionState } from "@/features/auth/state/admin-auth-slice";
import { notifySessionChange } from "@/features/auth/model/session-coordinator";
import { markSignedOut } from "@/features/auth/model/sign-out-intent";
import type { AuthLocationState } from "@/features/auth/types";

const WARNING_LEAD_MS = 5 * 60 * 1000;
// setTimeout clamps/fires-immediately past ~24.8 days (32-bit signed int ms).
// A 7-day remember-me session is safely under this, but chain shorter waits
// instead of one huge delay so this stays correct if that duration ever changes.
const MAX_TIMEOUT_MS = 24 * 60 * 60 * 1000;

/** Fires `callback` at `targetMs` (epoch ms), chaining setTimeouts past the 32-bit delay limit. */
const scheduleAt = (targetMs: number, callback: () => void): (() => void) => {
  let timerId: number;

  const tick = () => {
    const remaining = targetMs - Date.now();
    if (remaining <= 0) {
      callback();
      return;
    }
    timerId = window.setTimeout(tick, Math.min(remaining, MAX_TIMEOUT_MS));
  };

  tick();
  return () => window.clearTimeout(timerId);
};

/**
 * Warns the user 5 minutes before their session (`sessionExpiresAt`) lapses
 * and offers to extend it via a token refresh (FR-007-06). If they don't act,
 * the session is cleared and they're redirected to /login with context once
 * it actually expires.
 */
export const useSessionExpiryWarning = () => {
  const session = useAppSelector((state) => state.auth.session);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [refreshToken, { isLoading: isExtending }] = useRefreshTokenMutation();
  const [logoutRequest] = useLogoutMutation();
  const [isWarningVisible, setIsWarningVisible] = useState(false);

  const sessionExpiresAt = session?.sessionExpiresAt;

  useEffect(() => {
    if (!sessionExpiresAt) {
      setIsWarningVisible(false);
      return;
    }

    const expireSession = () => {
      markSignedOut();
      setIsWarningVisible(false);
      dispatch(clearAdminSessionState());
      notifySessionChange();
      void logoutRequest();
      const state: AuthLocationState = {
        message: "Your session has expired. Please sign in again.",
      };
      navigate("/login", { state });
    };

    const expiresAtMs = new Date(sessionExpiresAt).getTime();
    if (!Number.isFinite(expiresAtMs)) {
      // Malformed timestamp — treat as already expired rather than let a NaN
      // delay make setTimeout fire immediately in some other confusing way.
      expireSession();
      return;
    }

    const cancelWarn = scheduleAt(expiresAtMs - WARNING_LEAD_MS, () => setIsWarningVisible(true));
    const cancelExpire = scheduleAt(expiresAtMs, expireSession);

    return () => {
      cancelWarn();
      cancelExpire();
    };
  }, [sessionExpiresAt, dispatch, navigate, logoutRequest]);

  const extendSession = useCallback(async () => {
    if (!session) return;

    try {
      await refreshToken().unwrap();
      setIsWarningVisible(false);
    } catch {
      // A failed refresh means the session can't be extended; the expiry
      // timer above will fire on its own and redirect to login.
    }
  }, [session, refreshToken]);

  return {
    isWarningVisible,
    isExtending,
    extendSession,
    dismiss: () => setIsWarningVisible(false),
  };
};
