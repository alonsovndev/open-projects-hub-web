import React from "react";
import { EyeOutlined, UsergroupAddOutlined } from "@ant-design/icons";

import { RoleCard } from "@/features/home/components/role-card";
import { useRoleSelection } from "@/features/home/hooks/use-role-selection";
import type { RoleIconType } from "@/features/home/types";

import styles from "./role-selection.module.scss";

const getRoleIcon = (iconType: RoleIconType) => {
  if (iconType === "admin") {
    return <UsergroupAddOutlined />;
  }

  return <EyeOutlined />;
};

export const RoleSelection: React.FC = () => {
  const roleSelection = useRoleSelection();

  return (
    <div className={styles.cardContainer}>
      {roleSelection.roles.map((role) => (
        <RoleCard
          key={role.id}
          title={role.title}
          description={role.description}
          icon={getRoleIcon(role.iconType)}
          iconType={role.iconType}
          buttonText={role.buttonText}
          buttonType={role.buttonType}
          onClick={() => roleSelection.handleSelectRole(role.path)}
        />
      ))}
    </div>
  );
};
