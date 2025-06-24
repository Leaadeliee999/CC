import React from "react";
import { useNavigate } from "react-router-dom";
import "./Level3.css";

function Level3() {
  const navigate = useNavigate();

  return (
    <div className="level3-page">
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
        onClick={() => navigate("/gameplay3")}
      />
    </div>
  );
}

export default Level3;