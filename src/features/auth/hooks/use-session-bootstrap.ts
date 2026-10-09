import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useRefreshTokenMutation } from "@/features/auth/api/admin-auth-api";
import { applyRefreshedSession } from "@/features/auth/model/apply-refreshed-session";
import { sessionStorage } from "@/features/auth/model/session-storage";
import {
  clearAdminSessionState,
  sessionBootstrapFinished,
} from "@/features/auth/state/admin-auth-slice";

/**
 * Resumes a persisted session on app boot by exchanging the stored refresh
 * token for a fresh access token — the access token itself is never
 * persisted, so a page reload otherwise always starts logged out regardless
 * of "remember me" (FR-007-06/07).
 */
export const useSessionBootstrap = () => {
  const isBootstrapping = useAppSelector((state) => state.auth.isBootstrapping);
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  // StrictMode runs this effect twice in development. Refresh tokens are single-use, so a
  // second concurrent refresh with the same token is rejected and would end the session.
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isBootstrapping || hasStarted.current) return;
    hasStarted.current = true;

    const stored = sessionStorage.load();
    if (!stored?.refreshToken) {
      dispatch(sessionBootstrapFinished());
      return;
    }

    refreshToken({ refreshToken: stored.refreshToken })
      .unwrap()
      .then((response) => applyRefreshedSession(dispatch, stored, response))
      .catch((error: unknown) => {
        const status = (error as { status?: number | string } | undefined)?.status;
        if (status === 401) {
          // The refresh token itself was rejected (expired/revoked) — it's dead, drop it.
          dispatch(clearAdminSessionState());
        } else {
          // Transient failure (network blip, 5xx, timeout) — leave the persisted
          // session alone so a later reload can retry; just stop showing the spinner.
          dispatch(sessionBootstrapFinished());
        }
      });
    // Intentionally runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isBootstrapping };
};
