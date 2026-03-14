import { useNavigate } from "react-router-dom";

export const useAdminWelcome = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  const handleOpenViewer = () => {
    navigate("/viewer");
  };

  return {
    handleSignOut,
    handleOpenViewer,
  };
};
