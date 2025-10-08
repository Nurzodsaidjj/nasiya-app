import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Image, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useGetDebtors } from "../../query/debtor/use-debtors-query";
import { useDeleteDebtor } from "../../query/debtor/use-debtor-mutations";
import type { Debtor } from "../../../types/index";
import { loadState } from "../../storage/store";
import { jwtDecode } from "jwt-decode";
import { useGetStore } from "../../query/use-stores-query";

const Debtors = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userRole = loadState("role");
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(
    undefined
  );
  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    undefined
  );
  const storesQuery = userRole === "ADMIN" ? useGetStore() : undefined;
  const stores = storesQuery?.data;

  useEffect(() => {
    const token =
      userRole === "STORE"
        ? loadState("store") || sessionStorage.getItem("store")
        : loadState("admin") || sessionStorage.getItem("admin");
    if (token && userRole === "STORE") {
      const decodedToken: { id: string } = jwtDecode(token);
      setCurrentStoreId(decodedToken.id);
      setSelectedStoreId(decodedToken.id); // Set selectedStoreId for STORE role
    }
    if (
      userRole === "ADMIN" &&
      stores &&
      stores.length > 0 &&
      !selectedStoreId
    ) {
      setSelectedStoreId(stores[0].id);
    }
  }, [userRole, stores, selectedStoreId]);

  const {
    data: debtors,
    isLoading: isDebtorsLoading,
    isError: isDebtorsError,
  } = useGetDebtors();

  useEffect(() => {
    console.log("useGetDebtors enabled status:", !!(selectedStoreId || currentStoreId));
    console.log("Current Store ID:", currentStoreId);
    console.log("Selected Store ID:", selectedStoreId);
  }, [selectedStoreId, currentStoreId]);
  const { mutate: deleteDebtor, isPending: isDeleting } = useDeleteDebtor();

  const handleDelete = (id: string) => {
    deleteDebtor(id, {
      onSuccess: () => {
        message.success("Debtor deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["debtors"] });
      },
      onError: (error) => {
        message.error(`Failed to delete debtor: ${error.message}`);
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imagesDebtor",
      key: "imagesDebtor",
      render: (imagesDebtor: { imageUrl: string }[]) =>
        imagesDebtor && imagesDebtor.length > 0 ? (
          <Image.PreviewGroup>
            {imagesDebtor.map((image, index) => (
              <Image
                key={index}
                src={image.imageUrl}
                width={110}
                height={110}
                style={{ objectFit: "cover", marginRight: index < imagesDebtor.length - 1 ? 8 : 0 }}
              />
            ))}
          </Image.PreviewGroup>
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone Number",
      dataIndex: ["store", "phoneNumber"],
      key: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Debtor) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              if (userRole === "SUPER ADMIN") {
                navigate(`/super-admin/debtors/${record.id}`);
              } else if (userRole === "ADMIN") {
                navigate(`/admin/debtors/${record.id}`);
              } else {
                navigate(`/store-dashboard/debtors/${record.id}`);
              }
            }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            loading={isDeleting}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isDebtorsLoading) {
    return <div>Loading debtors...</div>;
  }

  if (isDebtorsError) {
    return <div>Error loading debtors.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Debtors List</h1>
        <div style={{ display: "flex", gap: 16 }}>
          {userRole === "ADMIN" && (
            <Select
              style={{ minWidth: 200 }}
              value={selectedStoreId}
              onChange={setSelectedStoreId}
              placeholder="Select store"
            >
              {stores?.map((store) => (
                <Select.Option key={store.id} value={store.id}>
                  {store.fullName}
                </Select.Option>
              ))}
            </Select>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              if (userRole === "SUPER ADMIN") {
                navigate("/super-admin/debtors/create");
              } else if (userRole === "ADMIN") {
                navigate("/admin/debtors/create");
              } else {
                navigate("/store-dashboard/debtors/create");
              }
            }}
          >
            Add Debtor
          </Button>
        </div>
      </div>
      <Table
        dataSource={debtors}
        columns={columns}
        rowKey="id"
        loading={isDebtorsLoading}
      />
    </div>
  );
};

export default Debtors;
