import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextObject";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(() => !!localStorage.getItem("admin_token"));

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid session");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setAdmin(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem("admin_token");
        setToken(null);
        setAdmin(null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("admin_token", data.token);
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, admin, loading, login, logout, isAuthenticated: !!token && !!admin }}
    >
      {children}
    </AuthContext.Provider>
  );
}