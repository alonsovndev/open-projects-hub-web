import React from "react";
import { useNavigate } from "react-router-dom";
import { RoleCard } from "@/features/home/components/role-card";
import styles from "./role-selection.module.scss";
import { rolesConfig } from "./roles-config";

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.cardContainer}>
      {rolesConfig.map((role) => (
        <RoleCard
          key={role.id}
          title={role.title}
          description={role.description}
          icon={role.icon}
          iconType={role.iconType}
          buttonText={role.buttonText}
          buttonType={role.buttonType}
          onClick={() => navigate(role.path)}
        />
      ))}
    </div>
  );
};
