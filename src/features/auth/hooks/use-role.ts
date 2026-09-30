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
  const isMember = hasRole("member");
  const isViewer = hasRole("viewer");

  return {
    role: user?.role,
    hasRole,
    hasAnyRole,
    isAdmin,
    isMember,
    isViewer,
    /** Admins and members create and change workspace data; viewers only read it. */
    canEdit: isAdmin || isMember,
    /** Only the workspace Admin adds teammates and viewers. */
    canManageTeam: isAdmin,
  };
};
