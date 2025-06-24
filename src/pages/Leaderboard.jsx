import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map(doc => doc.data());

      const sorted = users
        .filter(u => u.levels_completed && u.total_time)
        .map(user => ({
          ...user,
          avg_time: Math.round(user.total_time / user.levels_completed)
        }))
        .sort((a, b) => {
          if (b.levels_completed !== a.levels_completed) {
            return b.levels_completed - a.levels_completed;
          } else {
            return a.total_time - b.total_time;
          }
        });

      setPlayers(sorted);
    };

    fetchData();
  }, []);

  return (
    <div className="leaderboard-container">
      {/* Tombol Back */}
      <img
        src="/assets/back-icon.png"
        alt="Back"
        onClick={() => navigate("/start")}
        className="back-button"
      />

      <div className="leaderboard-table">
        <h1>RANK</h1>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.email || index} className="leaderboard-row">
              <td className="rank-number">{index + 1}</td>
              <td className="player-info">
                <img src="/assets/profile-icon.png" alt="Avatar" className="profile-img" />
                <div className="player-details">
                  <div className="player-name">{player.username || player.email}</div>
                  <div className="player-stats">
                    <div>
                      <span className="label">Level Completed</span>
                      <span>{player.levels_completed}</span>
                    </div>
                    <div>
                      <span className="label">Total Time</span>
                      <span>{player.total_time}s</span>
                    </div>
                    <div>
                      <span className="label">Average Time</span>
                      <span>{player.avg_time}s</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </div>
    </div>
  );
}

export default Leaderboard;
