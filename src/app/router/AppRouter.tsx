import type { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { AdminDashboard } from "@/pages/admin-dashboard";
import { AdminWelcomePage } from "@/pages/admin-welcome";
import { ClientViewer } from "@/pages/client-viewer";
import { Home } from "@/pages/home";

export const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/welcome" element={<AdminWelcomePage />} />
      <Route path="/viewer" element={<ClientViewer />} />
    </Routes>
  );
};
