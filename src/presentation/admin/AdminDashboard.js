import React, { useState } from "react";
import PlayersCrud from "./PlayersCrud";
import CharactersCrud from "./CharactersCrud";
import "../../styles/Admin.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("players");

  return (
    <div className="admin-dashboard">
      <h2>👑 Admin Dashboard</h2>

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
