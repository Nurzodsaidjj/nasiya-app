import {
    LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  UserOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { loadState } from '../../storage/store';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = loadState('role'); 

  const removeToken = () => {
    localStorage.removeItem('admin'); 
    localStorage.removeItem('role');
    navigate('/login');
  };
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let linkData = [];

  if (userRole === 'ADMIN') {
    linkData = [
      {
        key: '/admin',
        path: '/admin',
        title: 'Profile',
        icon: UserOutlined,
      },
      {
        key: '/admin/stores/create',
        path: '/admin/stores/create',
        title: 'Store Yaratish',
        icon: ShoppingOutlined,
      },
      {
        key: '/admin/debtors',
        path: '/admin/debtors',
        title: 'Qarzdorlar',
        icon: TeamOutlined,
      },
      {
        key: '/admin/debtors/create',
        path: '/admin/debtors/create',
        title: 'Qarzdor Yaratish',
        icon: PlusOutlined, 
      },
    ];
  } else if (userRole === 'STORE') {
    linkData = [
      {
        key: '/store-dashboard',
        path: '/store-dashboard',
        title: 'Qarzdorlar',
        icon: TeamOutlined,
      },
      {
        key: '/store-dashboard/debtors/create',
        path: '/store-dashboard/debtors/create',
        title: 'Qarzdor Yaratish',
        icon: PlusOutlined, 
      },
    ];
  }

  const menuItems = linkData.map((el) => ({
    key: el.key,
    label: <Link to={el.path}>{el.title}</Link>,
    icon: React.createElement(el.icon),
  }));

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onBreakpoint={(broken) => setCollapsed(broken)}
        >
          <div className="flex items-center py-[15px] justify-center  gap-[20px]">
            <img src={logo} alt="img" />
            {!collapsed && (
              <p className="text-[16px] font-[500] text-white">Nasiya Savdo</p>
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]} 
            items={menuItems}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: '0 16px',
              background: colorBgContainer,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Button
              danger
              onClick={removeToken}
              className="mr-7 sm:py-2 lg:p-4 flex items-center gap-2"
            >
              <LogoutOutlined/>
              LogOut
            </Button>
          </Header>

          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default AdminLayout;