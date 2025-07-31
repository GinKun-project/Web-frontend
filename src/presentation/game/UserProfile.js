import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../../styles/UserProfile.css";

export default function UserProfile({ user, onLogout, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      className="profile-popup"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      <h3>Player Profile</h3>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Display Name:</strong> {user.displayName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Favorite Class:</strong> {user.favClass}</p>
      <p><strong>Bio:</strong> {user.bio}</p>
      <button className="profile-logout-btn" onClick={onLogout}>Logout</button>
    </motion.div>
  );
}
