import { ReactNode } from "react";

export interface RoleConfig {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconType: "admin" | "viewer";
  buttonText: string;
  buttonType: "primary" | "default";
  onClick: () => void;
}