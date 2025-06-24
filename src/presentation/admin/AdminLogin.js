import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginUseCase } from "../../domain/admin/usecases";
import "../../styles/Admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please enter both fields");
      return;
    }

    try {
      setLoading(true);
      const res = await adminLoginUseCase({ username, password });

      if (res?.token) {
        localStorage.setItem("adminToken", res.token);
        localStorage.setItem("adminUsername", res.username);
        navigate("/admin"); 
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please check credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2 className="admin-login-title">Admin Login</h2>

        {error && <div className="admin-error">{error}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="admin-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          required
        />

        <button type="submit" className="admin-login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
