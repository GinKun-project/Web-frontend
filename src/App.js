import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginScreen from "./presentation/auth/LoginScreen";
import SignupScreen from "./presentation/auth/SignupScreen";
import GameScreen from "./presentation/game/GameScreen";
import InGameScreen from "./presentation/game/InGameScreen";
import GameLoader from "./presentation/game/GameLoader"; // ✅ added

import AdminLogin from "./presentation/admin/AdminLogin";
import AdminDashboard from "./presentation/admin/AdminDashboard";

import "./styles/App.css";

function AppWrapper() {
  return <App />;
}

function App() {
  const [user, setUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    const adminToken = localStorage.getItem("adminToken");

    if (adminToken) {
      setAdminToken(adminToken);
      navigate("/admin");
    } else if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogin = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    navigate("/game");
  };

  const handleAdminLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
    navigate("/admin");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAdminToken(null);
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
          element={<SignupScreen onLogin={() => navigate("/")} />}
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
          path="/loader"
          element={user ? <GameLoader /> : <Navigate to="/" />} 
        />
        <Route
          path="/ingame"
          element={user ? <InGameScreen user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/admin-login"
          element={<AdminLogin onLogin={handleAdminLogin} />}
        />
        <Route
          path="/admin"
          element={adminToken ? <AdminDashboard /> : <Navigate to="/admin-login" />}
        />
      </Routes>
    </div>
  );
}

export default AppWrapper;
