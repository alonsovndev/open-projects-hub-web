import { FC } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Button, Card, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/shared/components/AppHeader";
import { Footer } from "@/shared/components/Footer";
import styles from "./AdminDashboard.module.scss";

const { Paragraph, Title } = Typography;

export const AdminDashboard: FC = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.pageContainer}>
      <AppHeader
        actions={
          <Button
            type="text"
            icon={<LogoutOutlined />}
            className={styles.headerAction}
            onClick={() => navigate("/")}
          >
            Sign Out
          </Button>
        }
      >
        <Tag className={styles.roleTag}>Admin</Tag>
      </AppHeader>

      <div className={styles.contentWrapper}>
        <Card className={styles.placeholderCard}>
          <Title level={2}>Admin Dashboard</Title>
          <Paragraph>
            This area is ready to host admin tools for managing projects,
            requirements, and approvals.
          </Paragraph>
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Card>
      </div>

      <Footer />
    </main>
  );
};
