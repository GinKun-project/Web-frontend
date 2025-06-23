import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginUseCase } from '../../domain/admin/usecases';
import "../../styles/Admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both fields");
      return;
    }

    try {
      const { token } = await adminLoginUseCase({ username, password });

      localStorage.setItem("adminToken", token);
      navigate("/admin");
    } catch (err) {
      setError("Login failed. Please check credentials.");
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2 className="admin-login-title">Admin Login</h2>

        {error && <div className="admin-login-error">{error}</div>}

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

        <button type="submit" className="admin-login-button"> Login
        </button>
      </form>
    </div>
  );
}
