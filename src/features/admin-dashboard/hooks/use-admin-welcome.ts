import { useNavigate } from "react-router-dom";

import { clearAdminSession, getAdminSession } from "@/features/admin-auth/model/admin-session";

export const useAdminWelcome = () => {
  const navigate = useNavigate();
  const session = getAdminSession();

  const handleSignOut = () => {
    clearAdminSession();
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
