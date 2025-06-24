import React from "react";
import { useNavigate } from "react-router-dom";
import "./Level1.css";

function Level1() {
  const navigate = useNavigate();

  return (
    <div className="level1-page">
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
        onClick={() => navigate("/gameplay1")}
      />
    </div>
  );
}

export default Level1;
