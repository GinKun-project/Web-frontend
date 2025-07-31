import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayersCrud from "./PlayersCrud";
import CharactersCrud from "./CharactersCrud";
import "../../styles/Admin.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("players");
  const navigate = useNavigate();

  // Check adminToken on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login"); // redirect if no token
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">
        <div className="admin-navbar-title">👑 Admin Dashboard</div>
        <div className="admin-navbar-tabs">
          <button
            className={`admin-navbar-tab${activeTab === "players" ? " active" : ""}`}
            onClick={() => setActiveTab("players")}
          >
            Players
          </button>
          <button
            className={`admin-navbar-tab${activeTab === "characters" ? " active" : ""}`}
            onClick={() => setActiveTab("characters")}
          >
            Characters
          </button>
        </div>
        <button className="admin-navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="admin-content">
        {activeTab === "players" ? <PlayersCrud /> : <CharactersCrud />}
      </div>
    </div>
  );
}
