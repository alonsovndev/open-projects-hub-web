import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearAdminSessionState } from "@/features/admin-auth/state/admin-auth-slice";

export const useAdminWelcome = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.adminAuth.session);

  const handleSignOut = () => {
    dispatch(clearAdminSessionState());
    navigate("/");
  };

  const handleOpenViewer = () => {
    navigate("/viewer");
  };

  return {
    session,
    handleSignOut,
    handleOpenViewer,
  };
};
