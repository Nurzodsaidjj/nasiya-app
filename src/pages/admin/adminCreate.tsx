import { Button, Form, Input, message } from "antd";
import { useCreateAdmin } from "../../query/useCreateAdmin";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { adminDAta } from "../../types";
import { AxiosError } from "axios";

const AdminCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateAdmin();

  const onFinish = (values: adminDAta) => {
    mutate(values, {
      onSuccess: () => {
        message.success("Admin muvaffaqiyatli yaratildi!");
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        navigate("/");
      },
      onError: (error: Error | AxiosError) => {
        let mes = "Xatolik yuz berdi!";
        if (error instanceof AxiosError) {
          if (
            error.response?.data &&
            typeof error.response.data === "object" &&
            "message" in error.response.data
          ) {
            mes = (error.response.data as { message: string }).message;
          } else if (error.message) {
            mes = error.message;
          }
        } else if (error.message) {
          mes = error.message;
        }
        form.setFields([
          {
            name: "password",
            errors: [mes],
          },
        ]);
      },
    });
  };

  return (
    <Form
      form={form}
      name="create-admin"
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
        rules={[{ required: true, message: "Iltimos, parol kiriting!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Yaratish
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminCreate;
