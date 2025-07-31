import React, { useState } from "react";
import { loginUseCase } from "../../domain/auth/usecases";
import "../../styles/Auth.css";

export default function LoginScreen({ onSignup, onLogin }) {
  const [email, setEmail] = useState("");         
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUseCase({email, password});   

      localStorage.setItem("authToken", res.token);
      localStorage.setItem("userData", JSON.stringify(res.user));

      onLogin();
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}    
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
