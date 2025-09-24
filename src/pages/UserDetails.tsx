import { Form, Typography, Input, Checkbox, Button, message } from "antd"; 
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "./assets/images/logo.png";
import axios from "axios"; 

type FieldType = {
    username?: string;
    password?: string;
    remember?: boolean;
};

function Login() {
    const onFinish = async (values: FieldType) => { 
        try {
            const response = await axios.post(
                "http://157.230.248.45:5050/api/v1/admin/signin", 
                {
                    username: values.username,
                    password: values.password,
                }
            );
            
            
            const token = response.data.token; // Agar response { token: "..." } bo'lsa
            localStorage.setItem("token", token); // LocalStorage ga saqlash
            
            message.success("Login muvaffaqiyatli!"); // Ant Design message bilan foydalanuvchiga ko'rsatish
            console.log("Success:", response.data); // Test uchun, productionda o'chirib tashlang
            
            // Agar redirect kerak bo'lsa (masalan, dashboard ga):
            // import { useNavigate } from "react-router-dom";
            // const navigate = useNavigate();
            // navigate("/dashboard");
        } catch (error) {
            console.error("Login xatosi:", error);
            message.error("Login xatosi: Username yoki password noto'g'ri!");
        }
    };

    const onFinishFailed = (errorInfo: object) => {
        console.log("Failed:", errorInfo);
    };
	const loginFormStyles = {
		form: { width: "50%", padding: "0px 100px" },
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
			<img
				src={logo}
				alt="logo"
				style={loginFormStyles.logo}
			/>

			<Typography.Title style={loginFormStyles.formTitle}>Sign In</Typography.Title>

			<Typography.Paragraph>
				Welcome back to our website! please enter your details below to sign in and use our
				sevices.
			</Typography.Paragraph>

			<Typography.Text strong>Username</Typography.Text>

			<Form.Item<FieldType>
				name="username"
				rules={[{ required: true, message: "Please input your username!" }]}
			>
				<Input
					prefix={<UserOutlined />}
					placeholder="Username"
				/>
			</Form.Item>

			<Typography.Text strong>Password</Typography.Text>

			<Form.Item<FieldType>
				name="password"
				rules={[{ required: true, message: "Please input your password!" }]}
			>
				<Input.Password
					prefix={<LockOutlined />}
					placeholder="Password"
				/>
			</Form.Item>

			<Form.Item<FieldType>
				name="remember"
				valuePropName="checked"
				wrapperCol={{ offset: 0, span: 16 }}
			>
				<Checkbox>Remember me</Checkbox>
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

			<Form.Item style={{ textAlign: "center" }}>
				<Typography.Text style={loginFormStyles.signupLink}>
					Don't have an account? <Typography.Link>Sign up now</Typography.Link>
				</Typography.Text>
			</Form.Item>
		</Form>
	);
}

export default Login;