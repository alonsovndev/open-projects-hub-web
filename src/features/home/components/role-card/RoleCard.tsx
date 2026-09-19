import React from "react";
import { Typography, Card, Button } from "antd";

import type { RoleButtonType, RoleIconType } from "@/features/home/types";

import styles from "./role-card.module.scss";

const { Title, Paragraph } = Typography;

export interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconType: RoleIconType;
  buttonText: string;
  buttonType?: RoleButtonType;
  onClick?: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  iconType,
  buttonText,
  buttonType = "default",
  onClick,
}) => {
  const iconWrapperClass = iconType === "admin" ? styles.adminIcon : styles.viewerIcon;

  return (
    <Card variant="outlined" className={styles.roleCard}>
      <div className={`${styles.cardIconWrapper} ${iconWrapperClass}`}>{icon}</div>
      <Title level={4} className={styles.cardTitle}>
        {title}
      </Title>
      <Paragraph className={styles.cardDescription}>{description}</Paragraph>
      <Button type={buttonType} className={styles.cardButton} onClick={onClick}>
        {buttonText}
      </Button>
    </Card>
  );
};
