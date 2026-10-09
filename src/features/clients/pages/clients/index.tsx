import type { FC } from "react";
import { Typography, Button, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ClientsTable } from "@/features/clients/components/clients-table";
import { ClientFormModal } from "@/features/clients/components/client-form-modal";
import { useClientsOverview } from "@/features/clients/hooks/use-clients-overview";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./clients.module.scss";

const { Title, Text } = Typography;

export const ClientsOverview: FC = () => {
  usePageTitle("Clients");
  const {
    clients,
    isLoading,
    isSaving,
    formOpen,
    editingClient,
    deleteError,
    clearDeleteError,
    handleCreateClick,
    handleEditClick,
    handleFormCancel,
    handleFormSubmit,
    handleDeleteClient,
  } = useClientsOverview();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <Title level={1} className={styles.pageTitle}>
            Clients
          </Title>
          <Text className={styles.subtitle}>
            Manage the clients your projects are associated with
          </Text>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreateClick}>
          New Client
        </Button>
      </div>

      {deleteError && (
        <Alert
          type="error"
          showIcon
          closable
          onClose={clearDeleteError}
          message="Cannot delete client"
          description={deleteError}
          role="alert"
          style={{ marginBottom: 16 }}
        />
      )}

      <ClientsTable
        clients={clients}
        loading={isLoading}
        onEditClient={handleEditClick}
        onDeleteClient={handleDeleteClient}
      />

      <ClientFormModal
        open={formOpen}
        initialValues={
          editingClient
            ? {
                name: editingClient.name,
                email: editingClient.email,
                phone: editingClient.phone,
                company: editingClient.company,
                address: editingClient.address,
                notes: editingClient.notes,
              }
            : undefined
        }
        loading={isSaving}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  );
};

export default ClientsOverview;
