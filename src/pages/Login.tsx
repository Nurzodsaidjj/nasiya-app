import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../assets/images/logo.png";
import { request } from "../request/request";
import { saveState } from "../storage/store";

type LoginFields = {
  username: string;
  password: string;
  remember?: boolean;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values: LoginFields) => {
    try {
      const res = await request.post("/admin/signin", {
        username: values.username,
        password: values.password,
      });

      const token = res.data.data.token;
      if (values.remember) {
        saveState("admin", token);
      } else {
        sessionStorage.setItem("admin", token);
      }

      message.success("Login muvaffaqiyatli!");
      navigate("/", { replace: true });
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      console.error("Login error:", error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("Formani to'g'ri to'ldiring!");
  };

  const loginFormStyles = {
    form: { padding: "0px 200px" },
    logo: { width: "40px" },
    formTitle: { fontWeight: 700 },
    submitButton: { backgroundColor: "#438ef7" },
    signupLink: { fontWeight: 500, color: "#353535" },
  };

  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={loginFormStyles.form}
    >
      <img src={logo} alt="logo" style={loginFormStyles.logo} />

      <Typography.Title style={loginFormStyles.formTitle}>
        Dasturga kirish
      </Typography.Title>

      <Typography.Paragraph>
        Iltimos, tizimga kirish uchun login va parolingizni kiriting.
      </Typography.Paragraph>

      <Typography.Text strong>Login</Typography.Text>

      <Form.Item<LoginFields>
        name="username"
        rules={[{ required: true, message: "Iltimos, loginingizni kiriting!" }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Login" />
      </Form.Item>

      <Typography.Text strong>Parol</Typography.Text>

      <Form.Item<LoginFields>
        name="password"
        rules={[{ required: true, message: "Iltimos, parolingizni kiriting!" }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="parol" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={loginFormStyles.submitButton}
        >
          Login
        </Button>
      </Form.Item>

      <Form.Item style={{ textAlign: "end" }}>
        <Typography.Link>Parolni unutdingizmi?</Typography.Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
