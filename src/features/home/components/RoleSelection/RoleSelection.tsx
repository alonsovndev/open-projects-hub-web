import React from "react";
import { RoleCard } from "../RoleCard";
import styles from "./RoleSelection.module.scss";
import { rolesConfig } from "./rolesConfig";

export const RoleSelection: React.FC = () => {
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
          onClick={role.onClick}
        />
      ))}
    </div>
  );
};
