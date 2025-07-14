import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="admin-panel">
      {/* Tombol Back */}
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-icon"
        onClick={() => navigate("/start")}
      />

      <h1>Control Room</h1>
      <div className="admin-menu">
        <button onClick={() => navigate("/admin-users")}>Player Dashboard</button>
        <button onClick={() => navigate("/admin-levels")}>Manage Levels</button>
      </div>
    </div>
  );
}

export default AdminPanel;
