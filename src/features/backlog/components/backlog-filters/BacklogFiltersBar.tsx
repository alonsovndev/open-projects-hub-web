import type { FC } from "react";
import { Input, Select, Space, Badge, Button } from "antd";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";

import type { BacklogFilters } from "@/features/backlog/types";
import type { ProjectPriority } from "@/features/dashboard/types";

import styles from "./backlog-filters.module.scss";

const { Search } = Input;

interface ProjectOption {
  label: string;
  value: string;
}

interface BacklogFiltersBarProps {
  filters: BacklogFilters;
  activeFilterCount: number;
  projectOptions: ProjectOption[];
  isLoadingProjects: boolean;
  onSearchChange: (search: string) => void;
  onProjectFilter: (project: string) => void;
  onPriorityFilter: (priority: ProjectPriority | "all") => void;
  onClearFilters: () => void;
}

const priorityOptions = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const allProjectsOption = { label: "All Projects", value: "all" };

export const BacklogFiltersBarComponent: FC<BacklogFiltersBarProps> = ({
  filters,
  activeFilterCount,
  projectOptions,
  isLoadingProjects,
  onSearchChange,
  onProjectFilter,
  onPriorityFilter,
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
          options={[allProjectsOption, ...projectOptions]}
          className={styles.filterSelect}
          loading={isLoadingProjects}
          suffixIcon={<FilterOutlined />}
        />

        <Select
          value={filters.priority}
          onChange={onPriorityFilter}
          options={priorityOptions}
          className={styles.filterSelect}
          suffixIcon={<FilterOutlined />}
        />

        {activeFilterCount > 0 && (
          <Badge count={activeFilterCount} offset={[-10, 0]}>
            <Button type="link" onClick={onClearFilters} className={styles.clearLink}>
              <ClearOutlined /> Clear Filters
            </Button>
          </Badge>
        )}
      </Space>
    </div>
  );
};
