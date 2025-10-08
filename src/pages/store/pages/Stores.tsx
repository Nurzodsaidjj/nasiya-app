import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Image, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {useGetStore} from '../../../query/use-stores-query'; 
import { useDeleteStore } from '../mutation/useDeleteStore';
import type { Store } from '../../../types/index';
import { useGetDebtors } from '../../../query/debtor/use-debtors-query';
import { loadState } from '../../../storage/store';

const DebtorsList = ({ storeId }: { storeId: string }) => {
  const { data: debtorsForStore, isLoading } = useGetDebtors(storeId); 

  if (isLoading) return <div>Loading debtors...</div>;

  if (!debtorsForStore || debtorsForStore.length === 0) {
    return <div>No debtors for this store.</div>;
  }

  const debtorColumns = [
    {
      title: 'Mahsulot rasmi',
      dataIndex: 'imagesDebtor',
      key: 'imagesDebtor',
      render: (imagesDebtor: { imageUrl: string }[]) =>
        imagesDebtor && imagesDebtor.length > 0 ? (
          <Image src={imagesDebtor[0].imageUrl} width={110} height={110} style={{ objectFit: 'cover' }} />
        ) : (
          <span>No Image</span>
        ),

    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <Table
      columns={debtorColumns}
      dataSource={debtorsForStore}
      rowKey="id"
      pagination={false}
    />
  );
};

const Stores = () => {
  const navigate = useNavigate();
  const userRole = loadState('role');
  const queryClient = useQueryClient();
  const { data: stores, isLoading, isError } = useGetStore();
  const { mutate: deleteStore, isPending: isDeleting } = useDeleteStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const showDebtorsModal = (storeId: string) => {
    setSelectedStoreId(storeId);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedStoreId(null);
  };

  const handleEdit = (id: string) => {
    if (userRole === 'SUPER ADMIN') {
      navigate(`/super-admin/stores/${id}`);
    } else {
      navigate(`/admin/stores/${id}`);
    }
  };

  const handleDelete = (id: string) => {
    deleteStore(id, {
      onSuccess: () => {
        message.success(`Store with ID ${id} deleted successfully`);
        queryClient.invalidateQueries({ queryKey: ['stores'] });
      },
      onError: (error) => {
        message.error(`Failed to delete store: ${error.message}`);
      },
    });
  };

  const handleCreate = () => {
    if (userRole === 'SUPER ADMIN') {
      navigate('/super-admin/stores/create');
    } else {
      navigate('/admin/stores/create');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Wallet',
      dataIndex: 'wallet',
      key: 'wallet',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Store) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>Edit</Button>
          <Button icon={<EyeOutlined />} onClick={() => showDebtorsModal(record.id)}>View Debtors</Button>
          <Popconfirm
            title="Are you sure to delete this store?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger loading={isDeleting}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading stores...</div>;
  }

  if (isError) {
    return <div>Error loading stores.</div>;
  }

  return (
    <div>
      <h1>Store Management</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ marginBottom: 16 }}>
        Add New Store
      </Button>
      <Table
        columns={columns}
        dataSource={stores}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Debtors List"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        {selectedStoreId && <DebtorsList storeId={selectedStoreId} />}
      </Modal>
    </div>
  );
};

export default Stores;
