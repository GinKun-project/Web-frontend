import React, { useState, useEffect } from "react";
import LoginScreen from "./presentation/auth/LoginScreen";
import SignupScreen from "./presentation/auth/SignupScreen";
import GameScreen from "./presentation/game/GameScreen";
import "./styles/App.css";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  // ✅ Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setPage("game");
    }
  }, []);

  const handleLogin = (username) => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser({ username }); // fallback
    }
    setPage("game");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPage("login");
  };

  return (
    <div className="app-bg">
      {page === "login" && (
        <LoginScreen
          onSignup={() => setPage("signup")}
          onLogin={handleLogin}
        />
      )}
      {page === "signup" && (
        <SignupScreen onLogin={() => setPage("login")} />
      )}
      {page === "game" && user && (
        <GameScreen user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
