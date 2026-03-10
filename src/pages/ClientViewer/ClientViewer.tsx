import { FC } from "react";
import { Typography, Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./ClientViewer.module.scss";

const { Title } = Typography;
const { Content } = Layout;

export const ClientViewer: FC = () => {
  const navigate = useNavigate();
  return (
    <Layout className={styles.pageLayout}>
      <Content className={styles.pageContent}>
        <Title level={2}>Client Viewer Placeholder</Title>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Content>
    </Layout>
  );
};