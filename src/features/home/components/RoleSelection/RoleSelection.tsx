import React from "react";
import { UsergroupAddOutlined, EyeOutlined } from "@ant-design/icons";
import { RoleCard } from "../RoleCard";
import styles from "./RoleSelection.module.scss";

export const RoleSelection: React.FC = () => {
  // Static configuration data for the roles
  const roles = [
    {
      id: "admin",
      title: "Admin Access",
      description: "Manage projects and run AI refinement.",
      icon: <UsergroupAddOutlined />,
      iconType: "admin" as const,
      buttonText: "Sign In as Admin",
      buttonType: "primary" as const,
      onClick: () => console.log("Navigate to Admin"),
    },
    {
      id: "viewer",
      title: "Client Viewer",
      description: "View approved requirements and project status.",
      icon: <EyeOutlined />,
      iconType: "viewer" as const,
      buttonText: "Access as Viewer",
      buttonType: "default" as const,
      onClick: () => console.log("Navigate to Viewer"),
    },
  ];

  return (
    <div className={styles.cardContainer}>
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          title={role.title}
          description={role.description}
          icon={role.icon}
          iconType={role.iconType}
          buttonText={role.buttonText}
          buttonType={role.buttonType}
          onClick={role.onClick}
        />
      ))}
    </div>
  );
};
