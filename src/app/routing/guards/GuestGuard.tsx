import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";

interface GuestGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export const GuestGuard: FC<GuestGuardProps> = ({ children, redirectTo = "/dashboard" }) => {
  const session = useAppSelector((state) => state.adminAuth.session);

  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
