import React from "react";
import { useNavigate } from "react-router-dom";
import "./Level.css";

function Level() {
  const navigate = useNavigate();

  const handleLevelClick = (level) => {
    navigate(`/level${level}`); // akan diarahkan ke halaman sesuai level
  };

  return (
    <div className="level-page">
      {/* Tombol Back */}
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-button"
        onClick={() => navigate("/start")}
      />

      {/* Judul */}
      <h1 className="level-title">LEVEL</h1>

      {/* Kontainer Level */}
      <div className="level-grid">
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <div
            key={level}
            className={`level-box level-${level}`}
            onClick={() => handleLevelClick(level)}
          >
            <img src="/assets/level-bg.png" alt={`Level ${level}`} />
            <span className="level-number">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Level;
