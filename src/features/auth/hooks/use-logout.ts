import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { useAppDispatch } from "@/app/store/hooks";
import { clearAdminSessionState } from "@/features/auth/state/admin-auth-slice";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    dispatch(clearAdminSessionState());
    message.success("Logged out successfully");
    navigate("/login");
  }, [dispatch, navigate]);

  return { logout };
};
