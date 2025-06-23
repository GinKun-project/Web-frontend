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
      <div className="admin-header">
        <h2>👑 Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === "players" ? "active" : ""}
          onClick={() => setActiveTab("players")}
        >
          Players
        </button>
        <button
          className={activeTab === "characters" ? "active" : ""}
          onClick={() => setActiveTab("characters")}
        >
          Characters
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "players" ? <PlayersCrud /> : <CharactersCrud />}
      </div>
    </div>
  );
}
