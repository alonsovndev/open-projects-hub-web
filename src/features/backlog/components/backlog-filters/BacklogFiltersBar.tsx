import type { FC } from "react";
import { Input, Select, Space, Badge } from "antd";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";

import type { BacklogFilters } from "@/features/backlog/types";
import type { ProjectPriority } from "@/features/dashboard/types";

import styles from "./backlog-filters.module.scss";

const { Search } = Input;

interface BacklogFiltersBarProps {
  filters: BacklogFilters;
  activeFilterCount: number;
  onSearchChange: (search: string) => void;
  onProjectFilter: (project: string) => void;
  onPriorityFilter: (priority: ProjectPriority | "all") => void;
  onAssigneeFilter: (assignee: string) => void;
  onClearFilters: () => void;
}

const priorityOptions = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const projectOptions = [
  { label: "All Projects", value: "all" },
  { label: "E-Commerce Platform", value: "PROJ-2024" },
  { label: "Admin Portal", value: "ADMIN-2024" },
];

const assigneeOptions = [
  { label: "All Assignees", value: "all" },
  { label: "John Doe", value: "John Doe" },
  { label: "Jane Smith", value: "Jane Smith" },
  { label: "Unassigned", value: "unassigned" },
];

export const BacklogFiltersBarComponent: FC<BacklogFiltersBarProps> = ({
  filters,
  activeFilterCount,
  onSearchChange,
  onProjectFilter,
  onPriorityFilter,
  onAssigneeFilter,
  onClearFilters,
}) => {
  return (
    <div className={styles.filtersBar}>
      <Space size="middle" wrap className={styles.filtersContent}>
        <Search
          placeholder="Search stories..."
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
          allowClear
        />

        <Select
          value={filters.project}
          onChange={onProjectFilter}
          options={projectOptions}
          className={styles.filterSelect}
          suffixIcon={<FilterOutlined />}
        />

        <Select
          value={filters.priority}
          onChange={onPriorityFilter}
          options={priorityOptions}
          className={styles.filterSelect}
          suffixIcon={<FilterOutlined />}
        />

        <Select
          value={filters.assignee}
          onChange={onAssigneeFilter}
          options={assigneeOptions}
          className={styles.filterSelect}
          suffixIcon={<FilterOutlined />}
        />

        {activeFilterCount > 0 && (
          <Badge count={activeFilterCount} offset={[-10, 0]}>
            <a onClick={onClearFilters} className={styles.clearLink}>
              <ClearOutlined /> Clear Filters
            </a>
          </Badge>
        )}
      </Space>
    </div>
  );
};
