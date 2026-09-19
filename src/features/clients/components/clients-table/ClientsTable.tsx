import type { FC } from "react";
import { memo, useMemo } from "react";
import { Table, Button, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import type { Client } from "@/shared/types/domain";

const { Text } = Typography;

interface ClientsTableProps {
  clients: Client[];
  loading?: boolean;
  onEditClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
}

const ClientsTableComponent: FC<ClientsTableProps> = ({
  clients,
  loading = false,
  onEditClient,
  onDeleteClient,
}) => {
  const columns: ColumnsType<Client> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text: string) => <Text strong>{text}</Text>,
      },
      {
        title: "Company",
        dataIndex: "company",
        key: "company",
        render: (text?: string) => <Text>{text || "—"}</Text>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text?: string) => <Text>{text || "—"}</Text>,
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        render: (text?: string) => <Text>{text || "—"}</Text>,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space size="small" wrap>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEditClient(record)}
              aria-label={`Edit ${record.name}`}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteClient(record)}
              aria-label={`Delete ${record.name}`}
            >
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [onEditClient, onDeleteClient]
  );

  return <Table columns={columns} dataSource={clients} rowKey="id" loading={loading} />;
};

export const ClientsTable = memo(ClientsTableComponent);
