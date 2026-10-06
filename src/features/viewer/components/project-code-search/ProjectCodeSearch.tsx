import type { FC } from "react";

import { KeyOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Divider, Form, Input, Typography } from "antd";

import { useProjectCodeSearch } from "@/features/viewer/hooks/use-project-code-search";
import type { ProjectCodeFormValues } from "@/features/viewer/types";

import styles from "./project-code-search.module.scss";

const { Title } = Typography;

interface ProjectCodeSearchProps {
  initialCode?: string;
  errorMessage?: string;
  onSearch: (accessCode: string) => void;
}

export const ProjectCodeSearch: FC<ProjectCodeSearchProps> = ({
  initialCode,
  errorMessage,
  onSearch,
}) => {
  const projectCodeSearch = useProjectCodeSearch({ onSearch });

  return (
    <Card className={styles.card}>
      <Title level={2} className={styles.title}>
        Client Review
      </Title>

      <Form<ProjectCodeFormValues>
        layout="vertical"
        className={styles.form}
        onFinish={projectCodeSearch.handleSubmit}
      >
        <Form.Item
          label="Project Access Code"
          name="projectCode"
          initialValue={initialCode}
          extra="Enter the access code your freelancer shared with you."
          rules={projectCodeSearch.projectCodeRules}
        >
          <Input
            size="large"
            prefix={<KeyOutlined className={styles.inputIcon} />}
            placeholder="e.g., PRJ-7K3M9XQ2"
            autoComplete="off"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" size="large" block>
          View Approved Requirements
        </Button>
      </Form>

      {errorMessage ? (
        <Alert className={styles.feedback} type="error" showIcon description={errorMessage} />
      ) : null}

      <Divider className={styles.divider} />

      <Button type="link" className={styles.backButton} onClick={projectCodeSearch.handleBack}>
        Back to home
      </Button>
    </Card>
  );
};
