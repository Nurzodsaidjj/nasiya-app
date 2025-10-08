import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { request } from '../../request/request';
import { useNavigate } from 'react-router-dom';

const StoreForgotPassword = () => {
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendEmail = async () => {
        setLoading(true);
        try {
            const res = await request.post('/store/forgot-password', { email });
            message.success("Emailga tiklash kodi yuborildi!");
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
            await request.post('/store/verify-otp', { email, otp });
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
            await request.post('/store/reset-password', { email, newPassword });
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
            case 'email':
                return (
                    <Form onFinish={handleSendEmail} layout="vertical">
                        <Form.Item name="email" rules={[{ required: true, message: 'Iltimos, emailingizni kiriting!' }, { type: 'email', message: 'Email xato kiritildi!' }]}>
                            <Input prefix={<MailOutlined />} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                <Typography.Title level={3} style={{ textAlign: 'center' }}>Do'kon Parolni Tiklash</Typography.Title>
                {renderStep()}
            </div>
        </div>
    );
};

export default StoreForgotPassword;
