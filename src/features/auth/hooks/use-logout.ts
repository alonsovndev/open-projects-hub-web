import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAdminSessionState } from "@/features/auth/state/admin-auth-slice";
import { useLogoutMutation } from "@/features/auth/api/admin-auth-api";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const refreshToken = useAppSelector((state) => state.auth.session?.refreshToken);
  const [logoutRequest] = useLogoutMutation();

  const logout = useCallback(() => {
    // Best-effort server-side revocation — logout must feel instant to the
    // user even if this call is slow or fails, so it isn't awaited. The
    // access token still expires naturally on its own short TTL either way.
    if (refreshToken) {
      logoutRequest({ refreshToken });
    }
    dispatch(clearAdminSessionState());
    message.success("Signed out.");
    navigate("/login");
  }, [dispatch, navigate, refreshToken, logoutRequest]);

  return { logout };
};
