import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordSelection = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Typography.Title>Parolni tiklash</Typography.Title>
            <Typography.Paragraph>Rolni tanlang</Typography.Paragraph>
            <div style={{ display: 'flex', gap: '16px' }}>
                <Button type="primary" onClick={() => navigate('/admin-forgot-password')}>
                    Admin
                </Button>
                <Button onClick={() => navigate('/store-forgot-password')}>
                    Do'kon
                </Button>
            </div>
        </div>
    );
};

export default ForgotPasswordSelection;
