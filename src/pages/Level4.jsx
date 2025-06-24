import React from "react";
import { useNavigate } from "react-router-dom";
import "./Level4.css";

function Level4() {
  const navigate = useNavigate();

  return (
    <div className="level4-page">
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
        onClick={() => navigate("/gameplay4")}
      />
    </div>
  );
}

export default Level4;