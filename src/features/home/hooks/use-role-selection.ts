import { useNavigate } from "react-router-dom";

import { homeRoles } from "@/resources/config/home-roles";

export const useRoleSelection = () => {
  const navigate = useNavigate();

  const handleSelectRole = (path: string) => {
    navigate(path);
  };

  return {
    roles: homeRoles,
    handleSelectRole,
  };
};
