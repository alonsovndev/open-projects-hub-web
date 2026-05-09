import type { FC } from "react";
import { memo, useMemo } from "react";
import { Table, Tag, Progress, Button, Space, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { EyeOutlined, EditOutlined, CalendarOutlined } from "@ant-design/icons";

import type { ProjectSummary, ProjectStatus, ProjectPriority } from "@/shared/types/domain";
import { PROJECT_STATUS_COLORS, PROJECT_PRIORITY_COLORS } from "@/shared/types/domain";
import type { ProjectSort } from "@/features/projects/types";
import { formatDate } from "@/shared/utils/date";

import styles from "./projects-table.module.scss";

interface ProjectsTableProps {
  projects: ProjectSummary[];
  sort: ProjectSort;
  onSortChange: (field: ProjectSort["field"]) => void;
  onViewProject: (projectCode: string) => void;
  onEditProject: (projectId: string) => void;
}

const { Text } = Typography;

const ProjectsTableComponent: FC<ProjectsTableProps> = ({
  projects,
  sort,
  onSortChange,
  onViewProject,
  onEditProject,
}) => {
  const columns: ColumnsType<ProjectSummary> = useMemo(
    () => [
      {
        title: "Project",
        dataIndex: "name",
        key: "name",
        sorter: true,
        sortOrder: sort.field === "name" ? (sort.order === "asc" ? "ascend" : "descend") : null,
        render: (text, record) => (
          <div className={styles.projectCell}>
            <Text strong className={styles.projectName}>
              {text}
            </Text>
            <Text type="secondary" className={styles.projectCode}>
              {record.code}
            </Text>
          </div>
        ),
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        render: (text) => <Text className={styles.clientText}>{text}</Text>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        sortOrder: sort.field === "status" ? (sort.order === "asc" ? "ascend" : "descend") : null,
        render: (status: ProjectStatus) => (
          <Tag color={PROJECT_STATUS_COLORS[status]} className={styles.statusTag}>
            {status}
          </Tag>
        ),
      },
      {
        title: "Priority",
        dataIndex: "priority",
        key: "priority",
        sorter: true,
        sortOrder: sort.field === "priority" ? (sort.order === "asc" ? "ascend" : "descend") : null,
        render: (priority: ProjectPriority) => (
          <Tag color={PROJECT_PRIORITY_COLORS[priority]} className={styles.priorityTag}>
            {priority}
          </Tag>
        ),
      },
      {
        title: "Progress",
        key: "progress",
        render: (_, record) => {
          const percent =
            record.storiesCount > 0
              ? Math.round((record.completedStories / record.storiesCount) * 100)
              : 0;
          return (
            <div className={styles.progressCell}>
              <Progress
                percent={percent}
                size="small"
                strokeColor={{
                  "0%": "#0057c2",
                  "100%": "#006ef2",
                }}
              />
              <Text type="secondary" className={styles.progressText}>
                {record.completedStories}/{record.storiesCount}
              </Text>
            </div>
          );
        },
      },
      {
        title: "Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
        sorter: true,
        sortOrder: sort.field === "dueDate" ? (sort.order === "asc" ? "ascend" : "descend") : null,
        render: (date) => (
          <Space>
            <CalendarOutlined className={styles.dateIcon} />
            <Text>{formatDate(date)}</Text>
          </Space>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space size="small">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onViewProject(record.code)}
              className={styles.actionButton}
            >
              View
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEditProject(record.id)}
              className={styles.actionButton}
            >
              Edit
            </Button>
          </Space>
        ),
      },
    ],
    [sort, onViewProject, onEditProject]
  );

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ProjectSummary> | SorterResult<ProjectSummary>[]
  ) => {
    // Handle single sorter (not array)
    if (!Array.isArray(sorter) && sorter.field) {
      onSortChange(sorter.field as ProjectSort["field"]);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} projects`,
        }}
        onChange={handleTableChange}
        className={styles.projectsTable}
      />
    </div>
  );
};

export const ProjectsTable = memo(ProjectsTableComponent);
