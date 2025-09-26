import { Button, Form, Input, message } from "antd";
import { useEditAdmin } from "../../query/useEditAdmin";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { adminDAta } from "../../types";
import { useAdminQueryUsers } from "../../query/use-admin-query";
import { useEffect } from "react";
import { AxiosError } from "axios";

const AdminEdit = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { data: admins, isLoading: isAdminsLoading } = useAdminQueryUsers();
  const { mutate, isPending: isUpdating } = useEditAdmin();

  const currentAdmin = admins?.find((admin) => admin.id === id);

  useEffect(() => {
    if (currentAdmin) {
      form.setFieldsValue(currentAdmin);
    }
  }, [currentAdmin, form]);

  const onFinish = (values: adminDAta) => {
    if (!id) {
      message.error("Admin ID topilmadi.");
      return;
    }
    mutate(
      { ...values, id },
      {
        onSuccess: () => {
          message.success("Admin muvaffaqiyatli tahrirlandi!");
          queryClient.invalidateQueries({ queryKey: ["admins"] });
          navigate("/");
        },
        onError: (err: AxiosError) => {
          const mes = err?.response?.data?.message;
          if (mes === "Email already exists") {
            form.setFields([
              {
                name: "email",
                errors: [mes],
              },
            ]);
          } else if (mes === "Username already exists") {
            form.setFields([
              {
                name: "username",
                errors: [mes],
              },
            ]);
          } else {
            form.setFields([
              {
                name: "password",
                errors: [mes || "errors"],
              },
            ]);
          }
        },
      }
    );
  };

  if (isAdminsLoading) {
    return <h1>Yuklanmoqda...</h1>;
  }

  if (!currentAdmin) {
    return <h1>Admin topilmadi!</h1>;
  }

  return (
    <Form
      form={form}
      name="edit-admin"
      onFinish={onFinish}
      layout="vertical"
      initialValues={{ remember: true }}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Iltimos, username kiriting!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Iltimos, email kiriting!" },
          { type: "email", message: "Noto'g'ri email formati!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          { min: 8, message: "Parol kamida 8 belgidan iborat bo'lishi kerak!" },
        ]}
      >
        <Input.Password placeholder="Parolni o'zgartirish uchun kiriting" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          Tahrirlash
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminEdit;
