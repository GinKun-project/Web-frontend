import React from "react";
import "../../../styles/Settings.css";

export default function UserSettings({ user, onLogout }) {
  return (
    <div className="user-settings-container">
      <div className="user-profile-card">
        <div className="avatar-glow">
          <img
            src={user?.avatar || "/images/avatar-default.jpg"}
            alt="Avatar"
            className="user-avatar"
          />
        </div>
        <div className="profile-details">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Display Name:</strong> {user?.displayName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Favorite Class:</strong> {user?.favClass}</p>
          <p><strong>Bio:</strong> {user?.bio}</p>
        </div>
      </div>

      <div className="user-actions">
        <button className="user-btn edit-btn">Change Display Name</button>
        <button className="user-btn edit-btn">Change Avatar</button>
        <button className="user-btn logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
