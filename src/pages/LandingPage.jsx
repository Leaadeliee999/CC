import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      {/* Tombol Play */}
      <button className="play-button" onClick={handlePlayClick}>
        <img src="/assets/playbutton.png" alt="Play" className="play-icon" />
      </button>
    </div>
  );
}

export default LandingPage;
