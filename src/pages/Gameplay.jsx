import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./Gameplay.css";

const GRID_SIZE = 5;
const BOARD_SIZE = 420;
const PIECE_SIZE = BOARD_SIZE / GRID_SIZE;
const MAX_PREVIEW = 3;
const MySwal = withReactContent(Swal);

function Gameplay() {
  const { id } = useParams();
  const [imageSrc, setImageSrc] = useState("");
  const [pieces, setPieces] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [timer, setTimer] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [previewCount, setPreviewCount] = useState(0);
  const [levelList, setLevelList] = useState([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "levels", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setImageSrc(docSnap.data().gameplayImageUrl);
      }

      const levelsSnap = await getDocs(collection(db, "levels"));
      const levels = levelsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sortedLevels = levels.sort((a, b) => a.level - b.level);
      setLevelList(sortedLevels);
    };

    fetchData();
  }, [id]);

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

  const handleDragStart = (index) => setDraggedIndex(index);

  const handleDrop = (index) => {
    const newPieces = [...pieces];
    [newPieces[index], newPieces[draggedIndex]] = [newPieces[draggedIndex], newPieces[index]];
    setPieces(newPieces);
    setDraggedIndex(null);
    const correctNow = countCorrectPieces(newPieces);
    setCorrectCount(correctNow);

    if (isSolved(newPieces)) {
      clearInterval(timerRef.current);
      saveScoreToFirebase(timer);

      const currentIndex = levelList.findIndex((lvl) => lvl.id === id);
      const nextLevel = levelList[currentIndex + 1];

      MySwal.fire({
        title: "Bravo!",
        html: `<strong>Waktu Selesai:</strong> ${formatTime(timer)}`,
        showCancelButton: !!nextLevel,
        confirmButtonText: "Kembali ke Beranda",
        cancelButtonText: nextLevel ? "Pilih Level Berikutnya" : undefined,
        customClass: {
          popup: 'small-popup',
          confirmButton: 'small-button',
          cancelButton: 'small-button'
        },
        background: 'rgba(255,255,255,0.95)',
        color: '#333',
      }).then((res) => {
        if (res.dismiss === Swal.DismissReason.cancel && nextLevel) {
          navigate("/level"); // ⬅️ arahkan ke halaman pilih level
        } else {
          navigate("/start");
        }
      });
    }
  };

  const saveScoreToFirebase = async (time) => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      await setDoc(userRef, {
        ...data,
        total_time: (data.total_time || 0) + time,
        levels_completed: (data.levels_completed || 0) + 1,
      });
    }
  };

  const isSolved = (arr) => arr.every((val, idx) => val === idx);
  const countCorrectPieces = (arr) =>
    arr.reduce((count, val, idx) => (val === idx ? count + 1 : count), 0);
  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const handlePreview = () => {
    if (previewCount >= MAX_PREVIEW) {
      MySwal.fire({
        title: "Oops!",
        text: "Preview hanya bisa dilakukan 3x.",
        icon: "warning",
        customClass: { popup: 'small-popup', confirmButton: 'small-button' },
      });
      return;
    }

    setPreviewCount(prev => prev + 1);
    MySwal.fire({
      title: `Preview (${previewCount + 1}/${MAX_PREVIEW})`,
      imageUrl: imageSrc,
      imageWidth: 300,
      imageAlt: "Preview Image",
      customClass: { popup: 'small-popup', confirmButton: 'small-button' },
    });
  };

  const handleSettingClick = () => {
    MySwal.fire({
      title: "Menu",
      showCancelButton: true,
      confirmButtonText: "Kembali ke Beranda",
      cancelButtonText: "Lanjutkan",
      customClass: {
        popup: 'small-popup',
        confirmButton: 'small-button',
        cancelButton: 'small-button'
      },
      background: 'rgba(255,255,255,0.95)',
      color: '#333',
    }).then((res) => {
      if (res.isConfirmed) {
        navigate("/start");
      }
    });
  };

  return (
    <div className="gameplay1" style={{ backgroundImage: `url('/assets/Gameplay.png')` }}>
      <img
        src="/assets/setting-icon.png"
        alt="Settings"
        onClick={handleSettingClick}
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
      <div className="correct-count">{correctCount}/{GRID_SIZE * GRID_SIZE} pieces correct</div>

      <div
        className="puzzle-board"
        style={{
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${PIECE_SIZE}px)`,
          gap: "2px",
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
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: `${-(pieceIndex % GRID_SIZE) * PIECE_SIZE}px ${-Math.floor(pieceIndex / GRID_SIZE) * PIECE_SIZE}px`,
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

export default Gameplay;
