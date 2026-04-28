import type { FC } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  ProjectOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import type { DashboardStats } from "@/features/dashboard/types";

import styles from "./dashboard-stats.module.scss";

interface DashboardStatsProps {
  stats: DashboardStats;
}

export const DashboardStatsComponent: FC<DashboardStatsProps> = ({ stats }) => {
  const completionRate =
    stats.totalStories > 0 ? Math.round((stats.completedStories / stats.totalStories) * 100) : 0;

  return (
    <div className={styles.statsGrid}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Total Projects"
              value={stats.totalProjects}
              prefix={<ProjectOutlined className={styles.iconPrimary} />}
              valueStyle={{ color: "#0057c2", fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Active Projects"
              value={stats.activeProjects}
              prefix={<ProjectOutlined className={styles.iconSuccess} />}
              valueStyle={{ color: "#52c41a", fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Story Completion"
              value={completionRate}
              suffix="%"
              prefix={<CheckCircleOutlined className={styles.iconSuccess} />}
              valueStyle={{ color: "#52c41a", fontWeight: 700 }}
            />
            <div className={styles.subtext}>
              {stats.completedStories} of {stats.totalStories} stories
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Team Members"
              value={stats.teamMembers}
              prefix={<TeamOutlined className={styles.iconPrimary} />}
              valueStyle={{ color: "#0057c2", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
