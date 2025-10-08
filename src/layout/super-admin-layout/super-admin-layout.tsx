import {
  CrownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const { Header, Sider, Content } = Layout;

const linkData = [
  {
    key: "/super-admin",
    path: "/super-admin",
    title: "Admin Yaratish",
    icon: UserOutlined,
  },
  {
    key: "/super-admin/debtors",
    path: "/super-admin/debtors",
    title: "Qarzdor",
    icon: ShoppingOutlined,
  },
  {
    key: "/super-admin/stores",
    path: "/super-admin/stores",
    title: "Store Yaratish",
    icon: ShoppingOutlined,
  },
];

const menuItems = linkData.map((el) => ({
  key: el.key,
  label: <Link to={el.path}>{el.title}</Link>,
  icon: React.createElement(el.icon),
}));

interface SuperAdminLayoutProps {}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
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
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Button
            danger
            onClick={removeToken}
            className="mr-7 sm:py-2 lg:p-4 flex items-center gap-2"
          >
            <LogoutOutlined />
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
  );
};

export default SuperAdminLayout;
