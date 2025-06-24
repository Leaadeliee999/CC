import React from "react";
import { useNavigate } from "react-router-dom";
import "./Level6.css";

function Level6() {
  const navigate = useNavigate();

  return (
    <div className="level6-page">
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
        onClick={() => navigate("/gameplay6")}
      />
    </div>
  );
}

export default Level6;