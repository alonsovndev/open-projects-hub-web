import React from "react";
import { Typography, Layout, Flex } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
      <Content style={{ maxWidth: "800px", padding: "50px", textAlign: "center", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Flex vertical gap="large">
          <Title level={1} style={{ margin: 0 }}>Open Project Hub</Title>
          <Title level={3} style={{ marginTop: 0, color: "#1677ff", fontWeight: "normal" }}>
            Welcome to the Future of Freelance Project Management
          </Title>
          <Paragraph style={{ fontSize: "18px", lineHeight: "1.8", color: "#555" }}>
            An open-source platform for freelancers to manage clients, structure requirements, and use AI to transform ambiguous ideas into clear technical specs.
          </Paragraph>
        </Flex>
      </Content>
    </Layout>
  );
};

export default App;
