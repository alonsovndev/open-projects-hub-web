import type { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { AuthGuard, GuestGuard } from "@/app/routing/guards";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { ClientViewer } from "@/pages/client-viewer";
import { Home } from "@/pages/home";
import { UnauthorizedPage } from "@/pages/unauthorized";

export const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />

      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />

      <Route path="/viewer" element={<ClientViewer />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
};
