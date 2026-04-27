import { useAuth } from "./use-auth";
import type { UserRole } from "@/features/auth/types";

export const useRole = () => {
  const { user } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some((role) => user?.role === role);
  };

  const isAdmin = hasRole("admin");
  const isUser = hasRole("user");
  const isViewer = hasRole("viewer");

  return {
    role: user?.role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isUser,
    isViewer,
  };
};
