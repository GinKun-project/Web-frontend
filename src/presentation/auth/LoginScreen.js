import React, { useState } from "react";
import { loginUserUseCase } from "../../domain/auth/usecases";
import "../../styles/Auth.css";

export default function LoginScreen({ onSignup, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // 🔁 Make login request to backend
      const res = await loginUserUseCase(username, password);

      // ✅ Save token and user to localStorage
      localStorage.setItem("authToken", res.token);
      localStorage.setItem("userData", JSON.stringify(res.user));

      // 🔁 Proceed to game screen
      onLogin(res.user.username);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed.";
      setError(message);
    }
  }

  return (
    <div className="auth-container">
      <h2 className="game-title">Shadow Clash</h2>
      <form onSubmit={handleSubmit} className="auth-form">
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
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit">Login</button>
        <div className="auth-switch">
          Don't have an account? <span onClick={onSignup}>Sign up</span>
        </div>
      </form>
    </div>
  );
}
