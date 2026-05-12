import type { FC } from "react";
import { Input, Select, Button, Badge } from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import type { ProjectFilters, ProjectView } from "@/features/projects/types";
import type { ProjectStatus, ProjectPriority } from "@/features/dashboard/types";

import styles from "./projects-filter-bar.module.scss";

interface ProjectsFilterBarProps {
  filters: ProjectFilters;
  view: ProjectView;
  activeFilterCount: number;
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: ProjectStatus | "all") => void;
  onPriorityFilter: (priority: ProjectPriority | "all") => void;
  onViewChange: (view: ProjectView) => void;
  onClearFilters: () => void;
}

const { Search } = Input;

export const ProjectsFilterBar: FC<ProjectsFilterBarProps> = ({
  filters,
  view,
  activeFilterCount,
  onSearchChange,
  onStatusFilter,
  onPriorityFilter,
  onViewChange,
  onClearFilters,
}) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchSection}>
        <Search
          placeholder="Search projects by name, code, client..."
          allowClear
          size="large"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          prefix={<SearchOutlined />}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterSection}>
        <Select
          placeholder="Status"
          size="large"
          value={filters.status}
          onChange={onStatusFilter}
          className={styles.filterSelect}
          options={[
            { label: "All Statuses", value: "all" },
            { label: "Active", value: "active" },
            { label: "Completed", value: "completed" },
            { label: "On Hold", value: "on-hold" },
            { label: "Planning", value: "planning" },
          ]}
        />

        <Select
          placeholder="Priority"
          size="large"
          value={filters.priority}
          onChange={onPriorityFilter}
          className={styles.filterSelect}
          options={[
            { label: "All Priorities", value: "all" },
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ]}
        />

        {activeFilterCount > 0 && (
          <Badge count={activeFilterCount} offset={[-8, 8]}>
            <Button
              size="large"
              icon={<ClearOutlined />}
              onClick={onClearFilters}
              className={styles.clearButton}
            >
              Clear
            </Button>
          </Badge>
        )}
      </div>

      <div className={styles.viewSection}>
        <Button.Group size="large">
          <Button
            icon={<AppstoreOutlined />}
            type={view === "grid" ? "primary" : "default"}
            onClick={() => onViewChange("grid")}
          >
            Grid
          </Button>
          <Button
            icon={<UnorderedListOutlined />}
            type={view === "list" ? "primary" : "default"}
            onClick={() => onViewChange("list")}
          >
            List
          </Button>
        </Button.Group>
      </div>
    </div>
  );
};
