import type { FC } from "react";
import { Typography, Button, Empty } from "antd";
import { PlusOutlined, InboxOutlined } from "@ant-design/icons";

import { ProjectList } from "@/features/dashboard/components/project-list";
import { ProjectsFilterBar } from "@/features/projects/components/projects-filter-bar";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { EditProjectModal } from "@/features/projects/components/edit-project-modal";
import { useProjectsOverview } from "@/features/projects/hooks/use-projects-overview";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./projects.module.scss";

const { Title, Text } = Typography;

export const ProjectsOverview: FC = () => {
  usePageTitle("Projects");
  const {
    projects,
    filters,
    sort,
    view,
    currentPage,
    pageSize,
    totalCount,
    filteredCount,
    activeFilterCount,
    isUpdating,
    editModalOpen,
    editingProject,
    handleSearchChange,
    handleStatusFilter,
    handlePriorityFilter,
    handleSortChange,
    handleViewChange,
    handleClearFilters,
    handlePageChange,
    handleViewProject,
    handleEditProject,
    handleUpdateProject,
    handleCancelEdit,
    handleCreateProject,
    handleDeleteProject,
  } = useProjectsOverview();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <Title level={1} className={styles.pageTitle}>
              Projects Overview
            </Title>
            <Text className={styles.subtitle}>
              Showing {filteredCount} of {totalCount} projects
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
            className={styles.createButton}
          >
            New Project
          </Button>
        </div>
      </div>

      <ProjectsFilterBar
        filters={filters}
        view={view}
        activeFilterCount={activeFilterCount}
        onSearchChange={handleSearchChange}
        onStatusFilter={handleStatusFilter}
        onPriorityFilter={handlePriorityFilter}
        onViewChange={handleViewChange}
        onClearFilters={handleClearFilters}
      />

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            image={<InboxOutlined className={styles.emptyIcon} />}
            description={
              <div className={styles.emptyContent}>
                <Text className={styles.emptyTitle}>No projects found</Text>
                <Text className={styles.emptySubtitle}>
                  {activeFilterCount > 0
                    ? "Try adjusting your filters to see more results"
                    : "Get started by creating your first project"}
                </Text>
              </div>
            }
          >
            {activeFilterCount > 0 ? (
              <Button type="primary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            ) : (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateProject}>
                Create Project
              </Button>
            )}
          </Empty>
        </div>
      ) : view === "grid" ? (
        <ProjectList
          projects={projects}
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={filteredCount}
          onPageChange={handlePageChange}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      ) : (
        <ProjectsTable
          projects={projects}
          sort={sort}
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={filteredCount}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      )}

      <EditProjectModal
        open={editModalOpen}
        initialValues={
          editingProject
            ? {
                name: editingProject.name,
                description: editingProject.description,
                startDate: editingProject.dueDate, // Backend doesn't have startDate, using dueDate as placeholder
                endDate: editingProject.dueDate,
              }
            : undefined
        }
        loading={isUpdating}
        onSubmit={handleUpdateProject}
        onCancel={handleCancelEdit}
      />
    </div>
  );
};
export default ProjectsOverview;
