import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { loadState } from '../storage/store';

interface ProtectedRouteProps {
  roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const userRole = loadState('role');
  const tokenKey = userRole === "SUPER ADMIN" || userRole === "ADMIN" ? "admin" : "store";
  const token = loadState(tokenKey) || sessionStorage.getItem(tokenKey);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole || !roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
