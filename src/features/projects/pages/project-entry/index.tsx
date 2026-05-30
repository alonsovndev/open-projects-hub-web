import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./project-entry.module.scss";

interface ProjectIdFormValues {
  projectId: string;
}

export const ProjectEntry: FC = () => {
  usePageTitle("Project Entry");
  const navigate = useNavigate();
  const [form] = Form.useForm<ProjectIdFormValues>();

  const handleSubmit = async (values: ProjectIdFormValues) => {
    const id = values.projectId.trim();
    if (!id) {
      message.error("Please enter a project ID");
      return;
    }

    // TODO: Validate project ID with backend
    message.success("Project ID validated successfully");
    navigate(`/viewer/${id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <section className={styles.entrySection}>
          <div className={styles.entryContent}>
            <Link to="/role-selection" className={styles.backLink}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.backArrow}
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Back to Role Selection
            </Link>

            <div className={styles.iconWrapper}>
              <KeyOutlined className={styles.icon} />
            </div>

            <h1 className={styles.title}>Enter Project ID</h1>
            <p className={styles.description}>
              Paste the project ID shared by your admin to access the project.
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              className={styles.form}
            >
              <Form.Item
                label="Project ID"
                name="projectId"
                className={styles.formItem}
                rules={[{ required: true, message: "Please enter your project ID." }]}
              >
                <Input
                  size="large"
                  placeholder="e.g. PROJ-XXXX-XXXX"
                  autoComplete="off"
                  className={styles.input}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className={styles.submitButton}
              >
                Access Project
              </Button>
            </Form>

            <p className={styles.helpText}>Don&apos;t have a project ID? Contact your admin</p>

            <Link to="/" className={styles.homeLink}>
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
export default ProjectEntry;
