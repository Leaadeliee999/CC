import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import OrientationWarning from "../components/OrientationWarning";

function LandingPage() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Warning jika HP belum landscape */}
      <OrientationWarning />

      <div className="landing-page">
        {/* Tombol Play */}
        <button className="play-button" onClick={handlePlayClick}>
          <img src="/assets/playbutton.png" alt="Play" className="play-icon" />
        </button>

        {/* Logo di bawah tombol */}
        <img
          src="/assets/logo.png"
          alt="Canvas Conquest Logo"
          className="floating-logo"
        />
      </div>
    </>
  );
}

export default LandingPage;