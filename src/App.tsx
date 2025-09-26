import { message } from "antd";
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Users from "./pages/Users";
import AdminCreate from "./pages/admin/adminCreate";
import AdminEdit from "./pages/admin/adminEdit";
import LoginLayout from "./layout/login-layout.tsx";
import HomeLayout from "./layout/admin-layout/home-layout.tsx";
import { loadState } from "./storage/store.ts";

const App = () => {
  const [token, setToken] = useState<string | null>(
    loadState("admin") || sessionStorage.getItem("admin")
  );
  const [role, setRole] = useState<string | null>(
    loadState("role") || localStorage.getItem("role")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(loadState("admin") || sessionStorage.getItem("admin"));
      setRole(loadState("role") || localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    message.success("Test message: Success!");
    message.error("Test message: Error!");
  }, []);

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

        {token ? (
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />

            {role === "SUPER ADMIN" && (
              <>
                <Route path="/users" element={<Users />} />
                <Route path="/admincard" element={<AdminCreate />} />
                <Route path="/admincard/:id" element={<AdminEdit />} />
              </>
            )}
            {role === "ADMIN" && (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}
            {role === "STORE" && (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
