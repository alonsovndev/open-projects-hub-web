import type { FC } from "react";

import { Button, Card, Tag, Typography } from "antd";

import { useAdminWelcome } from "@/features/dashboard/hooks/use-admin-welcome";
import { adminWelcomePanels } from "@/resources/config/welcome-panels";

import styles from "./admin-welcome.module.scss";

const { Paragraph, Title } = Typography;

export const AdminWelcome: FC = () => {
  const adminWelcome = useAdminWelcome();

  return (
    <section className={styles.dashboard} aria-labelledby="admin-welcome-title">
      <div className={styles.content}>
        <section className={styles.hero}>
          <Tag className={styles.statusTag}>Dashboard</Tag>

          <Title level={1} id="admin-welcome-title" className={styles.title}>
            Welcome back, Admin
          </Title>

          {adminWelcome.session ? (
            <Paragraph className={styles.sessionMeta}>
              Signed in as {adminWelcome.session.displayName}
            </Paragraph>
          ) : null}

          <Paragraph className={styles.description}>
            You are now inside the admin area. This screen is a simple placeholder while the project
            workspace, AI refinement flow, and team tools are still being built.
          </Paragraph>

          <div className={styles.actions}>
            <Button type="primary" size="large" onClick={adminWelcome.handleOpenViewer}>
              Open Viewer Demo
            </Button>

            <Button size="large" onClick={adminWelcome.handleSignOut}>
              Return Home
            </Button>
          </div>
        </section>

        <section className={styles.panelGrid} aria-label="Admin dashboard preview panels">
          {adminWelcomePanels.map((panel) => (
            <Card key={panel.id} className={styles.panel}>
              <Tag className={styles.panelTag}>{panel.status}</Tag>

              <Title level={4} className={styles.panelTitle}>
                {panel.title}
              </Title>

              <Paragraph className={styles.panelDescription}>{panel.description}</Paragraph>
            </Card>
          ))}
        </section>
      </div>
    </section>
  );
};
