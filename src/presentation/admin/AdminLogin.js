import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../data/admin/adminApi";
import "../../styles/Admin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await loginAdmin(username, password);

    if (res.success) {
      localStorage.setItem("adminToken", res.token);
      localStorage.setItem("adminUsername", res.username);
      navigate("/admin");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-msg">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
