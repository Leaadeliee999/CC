import React from "react";
import { useNavigate } from "react-router-dom";
import "./Level5.css";

function Level5() {
  const navigate = useNavigate();

  return (
    <div className="level5-page">
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
        onClick={() => navigate("/gameplay5")}
      />
    </div>
  );
}

export default Level5;