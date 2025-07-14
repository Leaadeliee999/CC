import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Level.css";

function Level() {
  const [levels, setLevels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevels = async () => {
      const querySnapshot = await getDocs(collection(db, "levels"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sorted = data.sort((a, b) => a.level - b.level);
      setLevels(sorted);
    };

    fetchLevels();
  }, []);

  return (
    <div className="level-page">
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-icon"
        onClick={() => navigate("/start")}
      />
      <h1 className="level-title">Level</h1>

      <div className="level-grid">
        {levels.length === 0 ? (
          <p className="no-level-text">Belum ada level tersedia.</p>
        ) : (
          levels.map((lvl) => (
            <div
              key={lvl.id}
              className="level-box"
              onClick={() => navigate(`/description/${lvl.id}`)}
            >
              <img
                src="/assets/level-bg.png"
                alt="Level Frame"
                className="level-frame"
              />
              <span className="level-number">{lvl.level}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Level;
