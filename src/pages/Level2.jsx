import React from "react";
import { useNavigate } from "react-router-dom";
import "./Level2.css";

function Level2() {
  const navigate = useNavigate();

  return (
    <div className="level2-page">
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-button"
        onClick={() => navigate("/level")}
      />
      <img
        src="/assets/start-button.png"
        alt="Start"
        className="start-button"
        onClick={() => navigate("/gameplay2")}
      />
    </div>
  );
}

export default Level2;
