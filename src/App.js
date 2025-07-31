import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginScreen from "./presentation/auth/LoginScreen";
import SignupScreen from "./presentation/auth/SignupScreen";
import GameScreen from "./presentation/game/GameScreen";
import InGameScreen from "./presentation/game/InGameScreen";
import GameLoader from "./presentation/game/GameLoader";
import VsAiGameScreen from "./presentation/game/VsAiGameScreen";
import AchievementScreen from "./presentation/achievements/AchievementScreen";

import AdminLogin from "./presentation/admin/AdminLogin";
import AdminDashboard from "./presentation/admin/AdminDashboard";

import { logoutUseCase } from "./domain/auth/usecases";

import "./styles/App.css";

function AppWrapper() {
  return <App />;
}

function App() {
  const [user, setUser] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logoutUseCase();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("adminToken");
      setUser(null);
      setAdminToken(null);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");
        const adminToken = localStorage.getItem("adminToken");

        if (adminToken) {
          setAdminToken(adminToken);
          navigate("/admin");
        } else if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          if (window.location.pathname === "/") {
            navigate("/game");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const resetSessionTimeout = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (lastActivity && Date.now() - parseInt(lastActivity) > sessionTimeout) {
        handleLogout();
      }
    };

    resetSessionTimeout();
    
    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, resetSessionTimeout, true);
    });

    return () => {
      clearInterval(interval);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetSessionTimeout, true);
      });
    };
  }, [user, handleLogout]);

  const handleLogin = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
      navigate("/game");
    }
  };

  const handleAdminLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="app-bg" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="app-bg">
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/game" />
            ) : (
              <LoginScreen
                onSignup={() => navigate("/signup")}
                onLogin={handleLogin}
              />
            )
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
          path="/vsai"
          element={user ? <VsAiGameScreen /> : <Navigate to="/" />}
        />
        <Route
          path="/achievements"
          element={user ? <AchievementScreen /> : <Navigate to="/" />}
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
