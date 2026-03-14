import type { FC } from "react";

import { KeyOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Divider, Form, Input, Typography } from "antd";

import { useProjectCodeSearch } from "@/features/client-viewer/hooks/use-project-code-search";
import type { ProjectCodeFormValues } from "@/features/client-viewer/types";

import styles from "./project-code-search.module.scss";

const { Title } = Typography;

interface ProjectCodeSearchProps {
  onSearch: (projectCode: string) => boolean;
}

export const ProjectCodeSearch: FC<ProjectCodeSearchProps> = ({ onSearch }) => {
  const projectCodeSearch = useProjectCodeSearch({ onSearch });

  return (
    <Card className={styles.card}>
      <Title level={2} className={styles.title}>
        View Project Requirements
      </Title>

      <Form<ProjectCodeFormValues>
        layout="vertical"
        className={styles.form}
        onFinish={projectCodeSearch.handleSubmit}
        onValuesChange={projectCodeSearch.handleValuesChange}
      >
        <Form.Item
          label="Project Access Code"
          name="projectCode"
          initialValue="PRJ-123456"
          extra="Enter the 6-digit access code shared by your freelancer."
          rules={projectCodeSearch.projectCodeRules}
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

      {projectCodeSearch.errorMessage ? (
        <Alert className={styles.feedback} type="error" showIcon description={projectCodeSearch.errorMessage} />
      ) : null}

      <Divider className={styles.divider} />

      <Button type="link" className={styles.backButton} onClick={projectCodeSearch.handleBack}>Back to role selection</Button>
    </Card>
  );
};
