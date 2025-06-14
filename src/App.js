import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginScreen from "./presentation/auth/LoginScreen";
import SignupScreen from "./presentation/auth/SignupScreen";
import GameScreen from "./presentation/game/GameScreen";
import InGameScreen from "./presentation/game/InGameScreen";

import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ Needed for programmatic navigation

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

    navigate("/game"); // ✅ Go to dashboard
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/"); // ✅ Back to login
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="app-bg">
      <Routes>
        <Route
          path="/"
          element={
            <LoginScreen
              onSignup={handleSignupRedirect}
              onLogin={handleLogin}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupScreen
              onLogin={handleLoginRedirect}
            />
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
      </Routes>
    </div>
  );
}

export default App;
