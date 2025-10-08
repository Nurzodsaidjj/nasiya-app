import React, { useEffect, useState, useMemo } from "react";
import { Button, Form, Input, message, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateDebtor,
  useUpdateDebtor,
} from "../../query/debtor/use-debtor-mutations";
import { useGetDebtorById } from "../../query/debtor/use-debtors-query";
import { loadState } from "../../storage/store";
import { jwtDecode } from "jwt-decode";
import { useGetStore } from "../../query/use-stores-query";

const { Option } = Select;

const DebtorForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const userRole = loadState("role");

  useEffect(() => {
    if (!userRole) {
      message.error("User role not found. Please log in again.");
      navigate("/login");
    }
  }, [userRole, navigate]);

  const { data: debtor, isLoading: isDebtorLoading } = useGetDebtorById(id, {
    enabled: isEdit && ["SUPER ADMIN", "ADMIN", "STORE"].includes(userRole),
  });

  const { mutate: createDebtor, isPending: isCreating } = useCreateDebtor();
  const { mutate: updateDebtor, isPending: isUpdating } = useUpdateDebtor();

  const { data: stores, isLoading: isStoresLoading } = useGetStore({
    enabled: ["ADMIN", "SUPER ADMIN"].includes(userRole),
  });

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (isEdit && debtor) {
      form.setFieldsValue({
        ...debtor,
        storeId: debtor.store.id,
        phoneNumber: debtor.store.phoneNumber,
      });
    } else {
      if (userRole === "ADMIN") {
        const adminToken =
          loadState("admin") || sessionStorage.getItem("admin");
        if (adminToken) {
          try {
            const decodedToken: { store?: { id: string } } =
              jwtDecode(adminToken);
            if (decodedToken.store?.id) {
              form.setFieldsValue({ storeId: decodedToken.store.id });
            } else {
              message.error("Store ID not found in admin token.");
            }
          } catch (e) {
            console.error("Failed to decode admin token:", e);
            message.error("Failed to get admin store ID from token.");
          }
        }
      } else if (userRole === "STORE") {
        const storeToken =
          loadState("store") || sessionStorage.getItem("store");
        if (storeToken) {
          try {
            const decodedToken: { id: string } = jwtDecode(storeToken);
            form.setFieldsValue({ storeId: decodedToken.id });
          } catch (e) {
            console.error("Failed to decode store token:", e);
            message.error("Failed to get store ID from token.");
          }
        }
      }
    }
  }, [debtor, form, isEdit, userRole]);

  const handleUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleSubmit = (values: DebtorCreatePayload) => {
    let finalStoreId;

    if (userRole === "SUPER ADMIN") {
      finalStoreId = values.storeId; // SUPER ADMIN selects store from form
    } else if (userRole === "ADMIN") {
      const adminToken = loadState("admin") || sessionStorage.getItem("admin");
      if (adminToken) {
        try {
          const decodedToken: { store?: { id: string } } = jwtDecode(adminToken);
          if (decodedToken.store?.id) {
            finalStoreId = decodedToken.store.id;
          } else {
            message.error("Store ID not found in admin token.");
            return;
          }
        } catch (e) {
          console.error("Failed to decode admin token:", e);
          message.error("Failed to get admin store ID from token.");
          return;
        }
      } else {
        message.error("Admin token not found!");
        return;
      }
    } else if (userRole === "STORE") {
      const storeToken = loadState("store") || sessionStorage.getItem("store");
      if (storeToken) {
        try {
          const decodedToken: { id: string } = jwtDecode(storeToken);
          finalStoreId = decodedToken.id;
        } catch (e) {
          console.error("Failed to decode store token:", e);
          message.error("Failed to get store ID from token.");
          return;
        }
      } else {
        message.error("Store token not found!");
        return;
      }
    }

    if (!finalStoreId) {
      message.error("Store ID is required to create a debtor.");
      return;
    }

    const formData = createFormData(values, finalStoreId);

    if (isEdit && id) {
      updateDebtor(
        {
          id,
          formData: createFormData(values, finalStoreId),
        },
        {
          onSuccess: () => {
            message.success("Debtor updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["debtors"] });
            navigate(getRedirectPath(userRole));
          },
          onError: (error: any) => {
            message.error(
              error.response?.data?.message || "Failed to update debtor!"
            );
          },
        }
      );
    } else {
      createDebtor(formData, {
        onSuccess: () => {
          message.success("Debtor created successfully!");
          queryClient.invalidateQueries({ queryKey: ["debtors"] });
          navigate(getRedirectPath(userRole));
        },
        onError: (error) => {
          message.error(
            error.response?.data?.message || "Failed to create debtor!"
          );
        },
      });
    }
  };

  const createFormData = (values: DebtorCreatePayload, storeId: string) => {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("address", values.address);
    formData.append("description", values.description || "");
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("storeId", storeId);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("imageDebtor", fileList[0].originFileObj);
    }
    return formData;
  };

  const getRedirectPath = (role: string | null) => {
    if (role === "SUPER ADMIN") {
      return "/super-admin/debtors";
    } else if (role === "ADMIN") {
      return "/admin/debtors";
    } else if (role === "STORE") {
      return "/store-dashboard";
    }
    return "/login";
  };

  const isLoading = useMemo(
    () => isDebtorLoading || isStoresLoading,
    [isDebtorLoading, isStoresLoading]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      {userRole === "SUPER ADMIN" && (
        <Form.Item
          label="Store"
          name="storeId"
          rules={[{ required: true, message: "Please select a store!" }]}
        >
          <Select placeholder="Select a store">
            {stores?.map((store) => (
              <Option key={store.id} value={store.id}>
                {store.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: "Please input full name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input address!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>
      
      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[{ required: true, message: "Please input phone number!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Debtor Image" name="imageDebtor">
        <Upload
          listType="picture"
          maxCount={1}
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isCreating || isUpdating}
        >
          {isEdit ? "Update Debtor" : "Create Debtor"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DebtorForm;
