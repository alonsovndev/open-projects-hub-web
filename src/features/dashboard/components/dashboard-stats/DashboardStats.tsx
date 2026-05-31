import type { FC } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { ProjectOutlined } from "@ant-design/icons";

import type { DashboardStats } from "@/features/dashboard/types";

import styles from "./dashboard-stats.module.scss";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export const DashboardStatsComponent: FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className={styles.statsGrid}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={12}>
          <Card className={styles.statCard}>
            <Statistic
              title="Total Projects"
              value={stats.totalProjects}
              prefix={<ProjectOutlined className={styles.iconPrimary} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={12}>
          <Card className={styles.statCard}>
            <Statistic
              title="Active Projects"
              value={stats.activeProjects}
              prefix={<ProjectOutlined className={styles.iconSuccess} />}
              valueStyle={{ fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
