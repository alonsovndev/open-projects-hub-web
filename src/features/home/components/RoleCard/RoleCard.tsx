import React from "react";
import { Typography, Card, Button } from "antd";
import styles from "./RoleCard.module.scss";

const { Title, Paragraph } = Typography;

export interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconType: "admin" | "viewer";
  buttonText: string;
  buttonType?: "primary" | "default";
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
    <Card bordered={true} className={styles.roleCard}>
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
