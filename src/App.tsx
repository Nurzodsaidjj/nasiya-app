import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Users from "./pages/Users"; 
import LoginLayout from "./layout/login-layout.tsx";
import HomeLayout from "./layout/admin-layout/home-layout.tsx";
import { loadState } from "./storage/store.ts";

const App = () => {
  const token = loadState("admin") || sessionStorage.getItem("admin");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />
        <Route
          path="/"
          element={
            token ? (
              <HomeLayout>
                <Home />
              </HomeLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/users" element={token ? <HomeLayout><Users /></HomeLayout> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
