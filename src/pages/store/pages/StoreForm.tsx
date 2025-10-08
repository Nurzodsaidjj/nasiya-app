import React, { useEffect } from "react";
import { Button, Form, Input, message, InputNumber, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateStore } from "../mutation/useCreateStore";
import { useUpdateStore } from "../mutation/useUpdateStore";
import { useGetStoreById } from "../../../query/use-stores-query";
import type { Store } from "../../../types/index";
import { loadState } from "../../../storage/store"; 

const { Option } = Select;

const StoreForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;

  const {
    data: store,
    isLoading: isStoreLoading,
    error: storeError,
  } = useGetStoreById(id || "");
  const { mutate: createStore, isPending: isCreating } = useCreateStore();
  const { mutate: updateStore, isPending: isUpdating } = useUpdateStore();

  useEffect(() => {
    if (isEdit && store) {
      form.setFieldsValue({
        fullName: store.fullName,
        phoneNumber: store.phoneNumber,
        email: store.email,
        role: store.role,
        wallet: store.wallet,
        password: "",
      });
    }
  }, [store, form, isEdit]);

  const onFinish = (values: Partial<Omit<Store, "id" | "createdAt">>) => {
    const userRole = loadState("role");

    if (isEdit && id) {
      updateStore(
        { ...values, id },
        {
          onSuccess: () => {
            message.success("Store updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["stores"] });
            if (userRole === "SUPER ADMIN") {
              navigate("/super-admin/stores");
            } else if (userRole === "ADMIN") {
              navigate("/admin");
            } else if (userRole === "STORE") {
              navigate("/store-dashboard");
            } else {
              navigate("/");
            }
          },
          onError: (error: any) => {
            message.error(`Failed to update store: ${error.message}`);
          },
        }
      );
    } else {
      createStore(values as Omit<Store, "id" | "createdAt">, {
        onSuccess: () => {
          message.success("Store created successfully!");
          queryClient.invalidateQueries({ queryKey: ["stores"] });
          if (userRole === "SUPER ADMIN") {
            navigate("/super-admin/stores");
          } else if (userRole === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        },
        onError: (error) => {
          message.error(`Failed to create store: ${error.message}`);
        },
      });
    }
  };

  if (isEdit && isStoreLoading) {
    return <div>Loading store data...</div>;
  }

  if (isEdit && storeError) {
    return <div>Error loading store: {storeError.message}</div>;
  }

  if (isEdit && !store) {
    return <div>Store not found!</div>;
  }

  return (
    <div>
      <h1>{isEdit ? "Edit Store" : "Create New Store"}</h1>
      <Form form={form} name="store-form" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter the full name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please enter the phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: !isEdit, message: "Please enter the password!" }]}
        >
          <Input.Password
            placeholder={isEdit ? "Leave blank to keep current" : ""}
          />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select placeholder="Select a role">
            <Option value="SUPER ADMIN">SUPER ADMIN</Option>
            <Option value="ADMIN">ADMIN</Option>
            <Option value="STORE">STORE</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Wallet"
          name="wallet"
          rules={[
            { required: true, message: "Please enter the wallet amount!" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {isEdit ? "Update Store" : "Create Store"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StoreForm;
