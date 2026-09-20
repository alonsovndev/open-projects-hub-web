import type { AppDispatch } from "@/app/store/store";
import type { AdminSession } from "@/features/auth/types";
import { sessionStorage } from "@/features/auth/model/session-storage";
import { setAdminSession } from "@/features/auth/state/admin-auth-slice";

interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
  sessionExpiresAt?: string;
}

/**
 * Merges a refreshed access/refresh token pair into an existing session and
 * persists it, preserving the original remember-me storage choice. Shared by
 * useSessionBootstrap (boot-time silent refresh) and useSessionExpiryWarning
 * ("stay signed in") so the two refresh call sites can't drift apart.
 */
export const applyRefreshedSession = (
  dispatch: AppDispatch,
  baseSession: Omit<AdminSession, "token">,
  tokens: RefreshedTokens
): void => {
  dispatch(
    setAdminSession({
      session: {
        ...baseSession,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        sessionExpiresAt: tokens.sessionExpiresAt,
      },
      rememberMe: sessionStorage.isRemembered(),
    })
  );
};
