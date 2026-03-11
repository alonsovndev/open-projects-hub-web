import React, { useState } from "react";
import { KeyOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Divider, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./ProjectCodeSearch.module.scss";

const { Title } = Typography;

interface ProjectCodeFormValues {
  projectCode: string;
}

export const ProjectCodeSearch: React.FC = () => {
  const navigate = useNavigate();
  const [submittedCode, setSubmittedCode] = useState<string>("");

  const handleFinish = ({ projectCode }: ProjectCodeFormValues) => {
    setSubmittedCode(projectCode.trim().toUpperCase());
  };

  return (
    <Card className={styles.card}>
      <Title level={2} className={styles.title}>
        View Project Requirements
      </Title>

      <Form<ProjectCodeFormValues> layout="vertical" className={styles.form} onFinish={handleFinish}>
        <Form.Item
          label="Project Access Code"
          name="projectCode"
          extra="Enter the 6-digit access code shared by your freelancer."
          rules={[
            {
              required: true,
              message: "Please enter the project access code.",
            },
            {
              pattern: /^PRJ-\d{6}$/i,
              message: "Use the format PRJ-123456.",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<KeyOutlined className={styles.inputIcon} />}
            placeholder="e.g., PRJ-123456"
            autoComplete="off"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block>
          View Requirements
        </Button>
      </Form>

      {submittedCode ? (
        <Alert className={styles.feedback} type="info" showIcon message={`Searching for project ${submittedCode}`} />
      ) : null}

      <Divider className={styles.divider} />

      <Button type="link" className={styles.backButton} onClick={() => navigate("/")}>
        Back to role selection
      </Button>
    </Card>
  );
};
