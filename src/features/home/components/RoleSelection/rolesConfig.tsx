import { UsergroupAddOutlined, EyeOutlined } from "@ant-design/icons";
import { RoleConfig } from "@/features/home/types";

export const rolesConfig: RoleConfig[] = [
  {
    id: "admin",
    title: "Admin Access",
    description: "Manage projects and run AI refinement.",
    icon: <UsergroupAddOutlined />,
    iconType: "admin",
    buttonText: "Sign In as Admin",
    buttonType: "primary",
    path: "/admin",
  },
  {
    id: "viewer",
    title: "Client Viewer",
    description: "View approved requirements and project status.",
    icon: <EyeOutlined />,
    iconType: "viewer",
    buttonText: "Access as Viewer",
    buttonType: "default",
    path: "/viewer",
  },
];
