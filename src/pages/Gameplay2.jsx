import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Gameplay1.css";

const GRID_SIZE = 5;
const IMAGE_SRC = "/assets/level2.jpg";
const BOARD_SIZE = 420;
const PIECE_SIZE = BOARD_SIZE / GRID_SIZE;
const MAX_PREVIEW = 3;

const MySwal = withReactContent(Swal);

function Gameplay2() {
  const [pieces, setPieces] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [timer, setTimer] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [previewCount, setPreviewCount] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const indices = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    shuffleArray(indices);
    setPieces(indices);
    setCorrectCount(countCorrectPieces(indices));
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index) => {
    const newPieces = [...pieces];
    [newPieces[index], newPieces[draggedIndex]] = [newPieces[draggedIndex], newPieces[index]];
    setPieces(newPieces);
    setDraggedIndex(null);

    const correctNow = countCorrectPieces(newPieces);
    setCorrectCount(correctNow);

    if (isSolved(newPieces)) {
      clearInterval(timerRef.current);
      saveScoreToFirebase(timer); // Simpan ke Firebase
      setTimeout(() => {
        MySwal.fire({
          title: "Bravo!",
          html: `Completion Time: <strong>${formatTime(timer)}</strong>!<br/>New Gallery: <strong>Level 3</strong><br/><br/>`
            + `<img src="/assets/home-button.png" id="btn-home" style="width:100px;margin:10px;cursor:pointer" />`
            + `<img src="/assets/next-button.png" id="btn-next" style="width:100px;margin:10px;cursor:pointer" />`,
          showConfirmButton: false,
          didOpen: () => {
            document.getElementById("btn-home").addEventListener("click", () => {
              Swal.close();
              navigate("/start");
            });
            document.getElementById("btn-next").addEventListener("click", () => {
              Swal.close();
              navigate("/level3");
            });
          },
        });
      }, 300);
    }
  };

  const saveScoreToFirebase = async (time) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.data();
      const updatedLevels = (userData.levels_completed || 0) + 1;
      const updatedTime = (userData.total_time || 0) + time;

      await setDoc(userRef, {
        username: user.displayName || "Guest",
        email: user.email,
        levels_completed: updatedLevels,
        total_time: updatedTime,
      });
    } else {
      await setDoc(userRef, {
        username: user.displayName || "Guest",
        email: user.email,
        levels_completed: 1,
        total_time: time,
      });
    }
  };

  const isSolved = (arr) => arr.every((val, idx) => val === idx);
  const countCorrectPieces = (arr) =>
    arr.reduce((count, val, idx) => (val === idx ? count + 1 : count), 0);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const openSettings = () => {
    MySwal.fire({
      title: "Pengaturan",
      html:
        `<img src="/assets/home-button.png" id="settings-home" class="settings-home-icon" /><br/>` +
        `<button id="settings-continue" class="settings-button">Continue Game</button>`,
      showConfirmButton: false,
      customClass: {
        popup: "settings-popup",
        title: "settings-title",
      },
      didOpen: () => {
        document.getElementById("settings-home").addEventListener("click", () => {
          Swal.close();
          navigate("/start");
        });
        document.getElementById("settings-continue").addEventListener("click", () => {
          Swal.close();
        });
      },
    });
  };

  const handlePreview = () => {
    if (previewCount >= MAX_PREVIEW) {
      MySwal.fire("Oops!", "Preview limit reached (3x).", "warning");
      return;
    }

    setPreviewCount((prev) => prev + 1);
    MySwal.fire({
      title: `Preview (${previewCount + 1}/${MAX_PREVIEW})`,
      imageUrl: IMAGE_SRC,
      imageWidth: 300,
      imageAlt: "Preview Image",
    });
  };

  return (
    <div
      className="gameplay1"
      style={{ backgroundImage: `url('/assets/Gameplay.png')`, position: "relative" }}
    >
      <img
        src="/assets/setting-icon.png"
        alt="Settings"
        onClick={openSettings}
        className="setting-button"
      />
      <div className="preview-container">
        <img
          src="/assets/eye-icon.png"
          alt="Preview"
          onClick={handlePreview}
          className="preview-button"
        />
        <span className="preview-count">{MAX_PREVIEW - previewCount}</span>
      </div>
      <div className="timer">{formatTime(timer)}</div>
      <div className="correct-count">
        {correctCount}/{GRID_SIZE * GRID_SIZE} pieces placed correctly
      </div>
      <div
        className="puzzle-board"
        style={{
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
          gap: "2px",
          margin: "auto",
        }}
      >
        {pieces.map((pieceIndex, i) => (
          <div
            key={i}
            className="puzzle-piece"
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            style={{
              width: PIECE_SIZE,
              height: PIECE_SIZE,
              backgroundImage: `url(${IMAGE_SRC})`,
              backgroundPosition: `${-(pieceIndex % GRID_SIZE) * PIECE_SIZE}px ${-Math.floor(
                pieceIndex / GRID_SIZE
              ) * PIECE_SIZE}px`,
              backgroundSize: `${BOARD_SIZE}px ${BOARD_SIZE}px`,
              border: "1px solid #fff",
              boxSizing: "border-box",
              cursor: "grab",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Gameplay2;
