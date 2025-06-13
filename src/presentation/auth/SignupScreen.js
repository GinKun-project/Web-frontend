import React, { useState } from "react";
import axios from "axios";
import "../../styles/Auth.css";

const avatars = [
  { label: "Shadow Ninja", value: "ninja" },
  { label: "Arcane Mage", value: "mage" },
  { label: "Cyber Warrior", value: "warrior" }
];

const classes = ["Fighter", "Assassin", "Mage", "Tank", "Ranger"];

export default function SignupScreen({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    displayName: "",
    email: "",
    avatar: avatars[0].value,
    favClass: classes[0],
    bio: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      setMsg(res.data.message || "Signup successful!");
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed.";
      setError(message);
    }
  }

  return (
    <div className="auth-container">
      <h2 className="game-title">Shadow Clash - Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
        <input
          type="text"
          name="username"
          placeholder="Username*"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password*"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={form.displayName}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <label className="auth-label">Choose Avatar:</label>
        <select name="avatar" value={form.avatar} onChange={handleChange} className="auth-select">
          {avatars.map(av => (
            <option key={av.value} value={av.value}>{av.label}</option>
          ))}
        </select>
        <label className="auth-label">Favorite Class:</label>
        <select name="favClass" value={form.favClass} onChange={handleChange} className="auth-select">
          {classes.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea
          name="bio"
          placeholder="Short Bio"
          value={form.bio}
          onChange={handleChange}
          className="auth-textarea"
          rows={3}
          maxLength={140}
        />
        {msg && <div className="auth-msg">{msg}</div>}
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit">Sign Up</button>
        <div className="auth-switch">
          Already have an account? <span onClick={onLogin}>Login</span>
        </div>
      </form>
    </div>
  );
}
