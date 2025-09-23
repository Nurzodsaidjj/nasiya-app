import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export const AdminLayoutData: MenuProps["items"] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link to="/">Bosh sahifa</Link>,
  },
  {
    key: "/users",
    icon: <UserOutlined />,
    label: <Link to="/users">Foydalanuvchilar</Link>,
  },
];