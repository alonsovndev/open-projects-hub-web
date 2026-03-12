import { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { ClientViewer } from "@/pages/ClientViewer";
import { Home } from "@/pages/Home";

export const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/viewer" element={<ClientViewer />} />
    </Routes>
  );
};
