import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useLogoutMutation, useRefreshTokenMutation } from "@/features/auth/api/admin-auth-api";
import { sessionStorage } from "@/features/auth/model/session-storage";
import { subscribeSessionChanges } from "@/features/auth/model/session-coordinator";
import {
  clearAdminSessionState,
  sessionBootstrapFinished,
} from "@/features/auth/state/admin-auth-slice";
import { hasPendingRevocation, hasSignOutIntent } from "@/features/auth/model/sign-out-intent";

export const useSessionBootstrap = () => {
  const { isBootstrapping, generation } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  const [logoutRequest] = useLogoutMutation();
  const hasStarted = useRef(false);

  useEffect(() => subscribeSessionChanges(() => dispatch(clearAdminSessionState())), [dispatch]);
  useEffect(() => {
    sessionStorage.clear();
    if (!isBootstrapping || hasStarted.current) return;
    hasStarted.current = true;
    if (hasSignOutIntent()) {
      if (!hasPendingRevocation()) {
        dispatch(sessionBootstrapFinished(generation));
        return;
      }
      void logoutRequest({ retryPending: true })
        .unwrap()
        .catch(() => undefined)
        .finally(() => dispatch(sessionBootstrapFinished(generation)));
      return;
    }
    void refreshToken()
      .unwrap()
      .catch(() => dispatch(sessionBootstrapFinished(generation)));
  }, [isBootstrapping, generation, refreshToken, logoutRequest, dispatch]);
  return { isBootstrapping };
};
