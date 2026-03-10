import { FC } from "react";
import { Typography, Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.scss";

const { Title } = Typography;
const { Content } = Layout;

export const AdminDashboard: FC = () => {
  const navigate = useNavigate();
  return (
    <Layout className={styles.pageLayout}>
      <Content className={styles.pageContent}>
        <Title>Admin Dashboard Placeholder</Title>
        <Button type="primary" onClick={() => navigate("/")}>Back to Home</Button>
      </Content>
    </Layout>
  );
};