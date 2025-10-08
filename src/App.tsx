import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login/Login.tsx";
import AdminCreate from "./pages/admin/adminCreate";
import AdminEdit from "./pages/admin/adminEdit";
import { AdminUsers } from "./pages/admin/adminUsers.tsx";
import Stores from "./pages/store/pages/Stores.tsx";
import StoreForm from "./pages/store/pages/StoreForm.tsx";
import Debtors from "./pages/debtor/Debtors.tsx";
import DebtorForm from "./pages/debtor/DebtorForm.tsx";
import ForgotPasswordSelection from "./pages/forgot-password/ForgotPasswordSelection.tsx";
import AdminForgotPassword from "./pages/forgot-password/AdminForgotPassword.tsx";
import StoreForgotPassword from "./pages/forgot-password/StoreForgotPassword.tsx";

import LoginLayout from "./layout/login-layout/login-layout.tsx";
import SuperAdminLayout from "./layout/super-admin-layout/super-admin-layout.tsx";
import AdminLayout from "./layout/admin-layout/admin-layout.tsx";

import { NotFound } from "./components/NotFound.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

import { useAuth } from "./hooks/useAuth.ts";

const App = () => {
  const { token, role, setToken, setRole } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login
                onLoginSuccess={(newToken, newRole) => {
                  setToken(newToken);
                  setRole(newRole);
                }}
              />
            </LoginLayout>
          }
        />
        <Route element={<ProtectedRoute roles={["SUPER ADMIN"]} />}>
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<AdminUsers />} />
            <Route path="admincard" element={<AdminCreate />} />
            <Route path="admincard/:id" element={<AdminEdit />} />
            <Route path="debtors" element={<Debtors />} />
            <Route path="debtors/create" element={<DebtorForm />} />
            <Route path="debtors/:id" element={<DebtorForm />} />
            <Route path="stores" element={<Stores />} />
            <Route path="stores/create" element={<StoreForm />} />
            <Route path="stores/:id" element={<StoreForm />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Stores />} />
            <Route path="stores/create" element={<StoreForm />} />
            <Route path="stores/:id" element={<StoreForm />} />
            <Route path="debtors" element={<Debtors />} />
            <Route path="debtors/create" element={<DebtorForm />} />
            <Route path="debtors/:id" element={<DebtorForm />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={["STORE"]} />}>
          <Route path="/store-dashboard" element={<AdminLayout />}>
            <Route index element={<Debtors />} />
            <Route path="debtors/create" element={<DebtorForm />} />
            <Route path="debtors/:id" element={<DebtorForm />} />
          </Route>
        </Route>

        <Route path="/forgot-password" element={<ForgotPasswordSelection />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/store-forgot-password" element={<StoreForgotPassword />} />

        <Route
          path="/"
          element={
            <Navigate
              to={
                role === "SUPER ADMIN"
                  ? "/super-admin"
                  : role === "ADMIN"
                  ? "/admin"
                  : role === "STORE"
                  ? "/store-dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
