import { useState } from 'react';
import { Form, Input, Button, Typography, message, Modal } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { request } from '../../request/request';
import { useNavigate } from 'react-router-dom';

const AdminForgotPassword = () => {
    const [step, setStep] = useState<'username' | 'otp' | 'reset'>('username');
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendUsername = async () => {
        setLoading(true);
        try {
            const res = await request.post('/admin/forgot-password', { username });
            message.success("Usernamega tiklash kodi yuborildi!");
            const receivedOtp = res.data.data.otp;
            alert(`Sizning tasdiqlash kodingiz: ${receivedOtp}`);
            setStep('otp');
        } catch (error: any) {
            message.error(error.response?.data?.message || "Xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await request.post('/admin/verify-otp', { username, otp });
            message.success("OTP tasdiqlandi. Yangi parol kiriting.");
            setStep('reset');
        } catch (error: any) {
            message.error(error.response?.data?.message || "OTP xato yoki eskirgan!");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            await request.post('/admin/reset-password', { username, newPassword });
            message.success("Parol muvaffaqiyatli o'zgartirildi!");
            navigate('/login');
        } catch (error: any) {
            message.error(error.response?.data?.message || "Xatolik yuz berdi!");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'username':
                return (
                    <Form onFinish={handleSendUsername} layout="vertical">
                        <Form.Item name="username" rules={[{ required: true, message: 'Iltimos, loginingizni kiriting!' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Login" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Kodni yuborish
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case 'otp':
                return (
                    <Form onFinish={handleVerifyOtp} layout="vertical">
                        <Form.Item name="otp" rules={[{ required: true, message: 'Iltimos, OTP kodni kiriting!' }]}>
                            <Input placeholder="OTP kod" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Tasdiqlash
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case 'reset':
                return (
                    <Form onFinish={handleResetPassword} layout="vertical">
                        <Form.Item name="newPassword" rules={[{ required: true, message: 'Iltimos, yangi parolni kiriting!' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Yangi parol" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Parolni o'zgartirish
                            </Button>
                        </Form.Item>
                    </Form>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: 400, padding: 20, border: '1px solid #d9d9d9', borderRadius: 2 }}>
                <Typography.Title level={3} style={{ textAlign: 'center' }}>Admin Parolni Tiklash</Typography.Title>
                {renderStep()}
            </div>
        </div>
    );
};

export default AdminForgotPassword;
