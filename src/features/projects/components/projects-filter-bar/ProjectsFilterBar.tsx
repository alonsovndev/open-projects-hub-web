import type { FC } from "react";
import { Input, Select, Button, Badge, DatePicker } from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import type { ProjectFilters, ProjectView } from "@/features/projects/types";
import type { ProjectStatus, ProjectPriority } from "@/features/dashboard/types";
import { useGetClientsQuery, selectClientSummaries } from "@/features/clients/api/clients-api";
import { useRole } from "@/features/auth/hooks/use-role";

import styles from "./projects-filter-bar.module.scss";

interface ProjectsFilterBarProps {
  filters: ProjectFilters;
  view: ProjectView;
  activeFilterCount: number;
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: ProjectStatus | "all") => void;
  onPriorityFilter: (priority: ProjectPriority | "all") => void;
  onClientFilter: (clientId: string | "all") => void;
  onDateRangeChange: (range: [string, string] | null) => void;
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
  onClientFilter,
  onDateRangeChange,
  onViewChange,
  onClearFilters,
}) => {
  // The client list is limited to admins and members server-side, so any other role must
  // not issue the request at all — firing it just to swallow a 403 would be noise.
  const { canEdit } = useRole();
  const { data: clientsData } = useGetClientsQuery(undefined, { skip: !canEdit });
  const clientOptions = [
    { label: "All Clients", value: "all" },
    ...(clientsData ? selectClientSummaries(clientsData.items).map((c) => ({ label: c.name, value: c.id })) : []),
  ];
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
            { label: "Archived", value: "archived" },
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

        {canEdit && (
          <Select
            placeholder="Client"
            size="large"
            value={filters.clientId}
            onChange={onClientFilter}
            className={styles.filterSelect}
            options={clientOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            aria-label="Filter by client"
          />
        )}

        <DatePicker.RangePicker
          size="large"
          value={
            filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null
          }
          onChange={(dates) => {
            if (!dates || !dates[0] || !dates[1]) {
              onDateRangeChange(null);
            } else {
              onDateRangeChange([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")]);
            }
          }}
          allowClear
          className={styles.filterSelect}
          aria-label="Filter by created date"
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
