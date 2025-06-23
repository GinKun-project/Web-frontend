import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginScreen from "./presentation/auth/LoginScreen";
import SignupScreen from "./presentation/auth/SignupScreen";
import GameScreen from "./presentation/game/GameScreen";
import InGameScreen from "./presentation/game/InGameScreen";

import AdminLogin from "./presentation/admin/AdminLogin";
import AdminDashboard from "./presentation/admin/AdminDashboard";

import "./styles/App.css";

// ✅ Just return <App /> without BrowserRouter
function AppWrapper() {
  return <App />;
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (username) => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ username });
    }
    navigate("/game");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="app-bg">
      <Routes>
        <Route
          path="/"
          element={
            <LoginScreen
              onSignup={() => navigate("/signup")}
              onLogin={handleLogin}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupScreen onLogin={() => navigate("/")} />
          }
        />
        <Route
          path="/game"
          element={
            user ? (
              <GameScreen user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/ingame"
          element={
            user ? <InGameScreen user={user} /> : <Navigate to="/" />
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            localStorage.getItem("adminToken") ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default AppWrapper;
