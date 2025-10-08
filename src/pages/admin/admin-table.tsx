import { Button, Table } from "antd";
import type { adminDAta } from "";
import type { ColumnsType } from "antd/es/table";
import { useDeletemutation } from "../../query/useDeletemutation";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import "../../index.css";
import { useNavigate } from "react-router-dom";
interface AdminTableProps {
  dataSource: adminDAta[];
}

export const AdminTable = ({ dataSource }: AdminTableProps) => {
  const [loading, setloading] = React.useState<string | null>(null);
  const nav = useNavigate();
  const clinet = useQueryClient();
  const { mutate } = useDeletemutation();
  const DeleteItem = (id?: string) => {
    if (!id) return;
    mutate(id, {
      onSuccess: () => clinet.invalidateQueries({ queryKey: ["admins"] }),
      onSettled: () => {
        setloading(id);
      },
    });
  };
  const columns: ColumnsType<adminDAta> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="crad__btn">
            <Button
              loading={loading == record.id}
              onClick={() => DeleteItem(record.id!)}
              danger
            >
              Delete
            </Button>
            <Button
              onClick={() => nav(`/super-admin/admincard/${record.id}`)}
              type="primary"
            >
              EDIT
            </Button>
          </div>
        );
      },
      width: 200,
    },
  ];
  return (
    <>
      <Table<adminDAta>
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};
