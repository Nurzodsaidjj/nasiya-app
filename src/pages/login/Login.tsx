import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message, Radio } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { request } from "../../request/request";
import { saveState } from "../../storage/store";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

type LoginFields = {
  username: string;
  password: string;
  remember?: boolean;
};

const Login = ({ onLoginSuccess }: { onLoginSuccess?: (token: string, role: string) => void }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loginAs, setLoginAs] = useState("admin");
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const onFinish = async (values: any) => {
    const isAdmin = loginAs === "admin";
    const endpoint = isAdmin ? "/admin/signin" : "/store/signin";
    const payload = isAdmin
      ? { username: values.username, password: values.password }
      : { email: values.email, password: values.password };

    try {
      const res = await request.post(endpoint, payload);

    if (isAdmin) {
  const token = res.data.data.token;
  const role = res.data.data.role;
  saveState("admin", token);
  saveState("role", role);
} else {
  const accessToken = res.data.data.accessToken;
  const decodedToken: { role: string } = jwtDecode(accessToken);
  const role = decodedToken.role;
  saveState("store", accessToken); 
  saveState("role", role);
}


      message.success("Login muvaffaqiyatli!");

      if (onLoginSuccess) {
        const token = isAdmin ? res.data.data.token : res.data.data.accessToken;
        const role = isAdmin ? res.data.data.role : jwtDecode<{ role: string }>(res.data.data.accessToken).role;
        onLoginSuccess(token, role);
      }

      navigate("/", { replace: true });
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      console.error("Login error:", error);
    }
  };

  const onFinishFailed = () => {
    message.error("Formani to'g'ri to'ldiring!");
  };

  const handleRoleChange = (e: any) => {
    setLoginAs(e.target.value);
    form.resetFields();
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    try {
      await request.post("/store/forgot-password", { email: forgotEmail });
      message.success("Emailga tiklash kodi yuborildi!");
      setForgotStep('otp');
    } catch (error: any) {
      message.error(error.response?.data?.message || "Xatolik yuz berdi!");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setForgotLoading(true);
    try {
      const res = await request.post('/store/forgot-password', { email: forgotEmail });
      const receivedOtp = res.data.data.otp;
      alert(`Your verification code is: ${receivedOtp}`);
      setForgotStep('otp');
    } catch (error: any) {
      message.error(error.response?.data?.message || "Xatolik yuz berdi!");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setForgotLoading(true);
    try {
      await request.post("/store/verify-otp", { email: forgotEmail, otp });
      message.success("OTP tasdiqlandi. Yangi parol kiriting.");
      setForgotStep('reset');
    } catch (error: any) {
      message.error(error.response?.data?.message || "OTP xato yoki eskirgan!");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setForgotLoading(true);
    try {
      await request.post("/store/reset-password", { email: forgotEmail, newPassword });
      message.success("Parol muvaffaqiyatli o'zgartirildi!");
      setForgotStep('email');
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Xatolik yuz berdi!");
    } finally {
      setForgotLoading(false);
    }
  };

  const renderForgotStep = () => {
    switch (forgotStep) {
      case 'email':
        return (
          <Input
            prefix={<MailOutlined />}
            placeholder="Emailingizni kiriting"
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            type="email"
          />
        );
      case 'otp':
        return (
          <Input
            placeholder="Emailga kelgan OTP kodni kiriting"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={6}
          />
        );
      case 'reset':
        return (
          <Input.Password
            placeholder="Yangi parolni kiriting"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  const handleForgotOk = () => {
    if (forgotStep === 'email') return handleForgotPassword();
    if (forgotStep === 'otp') return handleVerifyOtp();
    if (forgotStep === 'reset') return handleResetPassword();
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
      form={form}
      name="login"
      labelCol={{ span: 8 }}
      layout="vertical"
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

      <Form.Item style={{ marginBottom: 24 }}>
        <Radio.Group onChange={handleRoleChange} value={loginAs}>
          <Radio.Button value="admin">Admin</Radio.Button>
          <Radio.Button value="store">Do'kon</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {loginAs === "admin" ? (
        <>
          <Typography.Text strong>Login</Typography.Text>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Iltimos, loginingizni kiriting!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Login" />
          </Form.Item>
        </>
      ) : (
        <>
          <Typography.Text strong>Email</Typography.Text>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Iltimos, emailingizni kiriting!" },
              { type: "email", message: "Email xato kiritildi!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
        </>
      )}
      <Typography.Text strong>Parol</Typography.Text>

      <Form.Item
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
        <Typography.Link onClick={() => navigate('/forgot-password')}>
          Parolni unutdingizmi?
        </Typography.Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
