import { useState, type FC } from "react";

import { KeyOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Divider, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./ProjectCodeSearch.module.scss";

const { Title } = Typography;

interface ProjectCodeFormValues {
  projectCode: string;
}

interface ProjectCodeSearchProps {
  onSearch: (projectCode: string) => boolean;
}

export const ProjectCodeSearch: FC<ProjectCodeSearchProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleFinish = ({ projectCode }: ProjectCodeFormValues) => {
    const normalizedCode = projectCode.trim().toUpperCase();
    const wasFound = onSearch(normalizedCode);

    if (!wasFound) {
      setErrorMessage("We couldn't find a project with that access code.");
      return;
    }

    setErrorMessage("");
  };

  const handleValuesChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <Card className={styles.card}>
      <Title level={2} className={styles.title}>
        View Project Requirements
      </Title>

      <Form<ProjectCodeFormValues>
        layout="vertical"
        className={styles.form}
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          label="Project Access Code"
          name="projectCode"
          initialValue="PRJ-123456"
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

      {errorMessage ? (
        <Alert className={styles.feedback} type="error" showIcon description={errorMessage} />
      ) : null}

      <Divider className={styles.divider} />

      <Button type="link" className={styles.backButton} onClick={() => navigate("/")}>Back to role selection</Button>
    </Card>
  );
};
