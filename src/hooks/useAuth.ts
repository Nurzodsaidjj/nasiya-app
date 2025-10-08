import { useEffect, useState } from "react";
import { loadState } from "../storage/store";

export const useAuth = () => {
  const [role, setRole] = useState<string | null>(
    loadState("role")
  );

  const [token, setToken] = useState<string | null>(() => {
    const currentRole = loadState("role");
    const tokenKey = currentRole === "SUPER ADMIN" || currentRole === "ADMIN" ? "admin" : "store";
    return loadState(tokenKey) || sessionStorage.getItem(tokenKey);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const currentRole = loadState("role");
      const tokenKey = currentRole === "SUPER ADMIN" || currentRole === "ADMIN" ? "admin" : "store";
      setToken(loadState(tokenKey) || sessionStorage.getItem(tokenKey));
      setRole(loadState("role"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { token, role, setToken, setRole };
};
