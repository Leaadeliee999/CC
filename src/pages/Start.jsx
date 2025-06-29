import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./Start.css";

function Start() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || "Guest");
      if (user.email === "rara@gmail.com") {
        setIsAdmin(true);
      }
    }
  }, []);

  const handlePlayClick = () => {
    navigate("/level");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <div className="landing-page">
      {/* Tombol Play */}
      <button className="play-button" onClick={handlePlayClick}>
        <img src="/assets/playbutton.png" alt="Play" className="play-icon" />
      </button>

      {/* Logo di bawah tombol play */}
      <img src="/assets/logo.png" alt="Canvas Conquest Logo" className="floating-logo" />

      {/* Top Right Info Box */}
      <div className="top-right-wrapper">
        <div className="info-box" onClick={handleProfileClick}>
          <img src="/assets/profile-icon.png" alt="Profile" className="icon-image" />
          <span className="label-text">{username}</span>
        </div>

        <div className="info-box" onClick={handleLeaderboardClick}>
          <img src="/assets/leaderboard-icon.png" alt="Leaderboard" className="icon-image" />
          <span className="label-text">Rank</span>
        </div>

        {isAdmin && (
          <div className="info-box" onClick={handleAdminClick}>
            <img src="/assets/admin.png" alt="Admin" className="icon-image" />
            <span className="label-text">Control Room</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Start;
