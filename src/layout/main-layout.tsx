import React from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div>
      <main>{children || <Outlet />}</main>
    </div>
  );
};

export default MainLayout;
