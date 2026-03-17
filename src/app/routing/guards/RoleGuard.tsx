import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import type { UserRole } from "@/features/admin-auth/types";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleGuard: FC<RoleGuardProps> = ({ children, allowedRoles, redirectTo = "/unauthorized" }) => {
  const session = useAppSelector((state) => state.adminAuth.session);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
