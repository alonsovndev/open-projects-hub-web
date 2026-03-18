import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children, redirectTo = "/login" }) => {
  const session = useAppSelector((state) => state.auth.session);

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
