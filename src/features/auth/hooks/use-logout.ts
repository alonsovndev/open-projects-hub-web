import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAppDispatch } from "@/app/store/hooks";
import { clearAdminSessionState } from "@/features/auth/state/admin-auth-slice";
import { useLogoutMutation } from "@/features/auth/api/admin-auth-api";
import { notifySessionChange } from "@/features/auth/model/session-coordinator";
import { sessionStorage } from "@/features/auth/model/session-storage";
import { markSignedOut } from "@/features/auth/model/sign-out-intent";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest] = useLogoutMutation();
  const logout = useCallback(() => {
    markSignedOut();
    dispatch(clearAdminSessionState());
    sessionStorage.clear();
    notifySessionChange();
    // Cookie revocation is queued behind any refresh already in flight.
    void logoutRequest();
    message.success("Signed out.");
    navigate("/login");
  }, [dispatch, navigate, logoutRequest]);
  return { logout };
};
