import { useState } from "react";
import { Modal, message } from "antd";

import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "@/features/clients/api/clients-api";
import type { ClientFormData } from "@/features/clients/components/client-form-modal";
import type { Client } from "@/shared/types/domain";

export const useClientsOverview = () => {
  const { data, isLoading } = useGetClientsQuery();
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const clients = data?.items ?? [];

  const handleCreateClick = () => {
    setEditingClient(null);
    setFormOpen(true);
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingClient(null);
  };

  const handleFormSubmit = async (values: ClientFormData) => {
    try {
      if (editingClient) {
        await updateClient({ id: editingClient.id, data: values }).unwrap();
        message.success("Client updated successfully!");
      } else {
        await createClient(values).unwrap();
        message.success("Client created successfully!");
      }
      setFormOpen(false);
      setEditingClient(null);
    } catch {
      message.error(editingClient ? "Failed to update client. Please try again." : "Failed to create client. Please try again.");
    }
  };

  const handleDeleteClient = (client: Client) => {
    setDeleteError(null);
    Modal.confirm({
      title: "Delete Client",
      content: `Delete "${client.name}"? This cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteClient(client.id).unwrap();
          message.success(`Client "${client.name}" deleted`);
        } catch (error) {
          const apiError = error as { data?: { message?: string } };
          setDeleteError(apiError?.data?.message ?? `Failed to delete "${client.name}". Please try again.`);
        }
      },
    });
  };

  return {
    clients,
    isLoading,
    isSaving: isCreating || isUpdating,
    isDeleting,
    formOpen,
    editingClient,
    deleteError,
    clearDeleteError: () => setDeleteError(null),
    handleCreateClick,
    handleEditClick,
    handleFormCancel,
    handleFormSubmit,
    handleDeleteClient,
  };
};
