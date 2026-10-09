import { useState } from "react";
import { Modal, message } from "antd";

import { getErrorMessage } from "@/shared/types/api";
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
        message.success("Client updated.");
      } else {
        await createClient(values).unwrap();
        message.success("Client created.");
      }
      setFormOpen(false);
      setEditingClient(null);
    } catch (error) {
      message.error(
        getErrorMessage(
          error,
          editingClient
            ? "We couldn't update the client. Please try again."
            : "We couldn't create the client. Please try again."
        )
      );
    }
  };

  const handleDeleteClient = (client: Client) => {
    setDeleteError(null);
    Modal.confirm({
      title: "Delete client",
      content: `Delete "${client.name}" and their archived projects? This action cannot be undone.`,
      okText: "Delete",
      okButtonProps: { danger: true },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteClient(client.id).unwrap();
          message.success(`Client "${client.name}" deleted.`);
        } catch (error) {
          setDeleteError(
            getErrorMessage(error, "We couldn't delete the client. Please try again.")
          );
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
