import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPen } from "react-icons/fa";
import "./AdminLevels.css";

function AdminLevels() {
  const [levelNumber, setLevelNumber] = useState("");
  const [descImage, setDescImage] = useState(null);
  const [gameplayImage, setGameplayImage] = useState(null);
  const [descPreview, setDescPreview] = useState(null);
  const [gameplayPreview, setGameplayPreview] = useState(null);
  const [levels, setLevels] = useState([]);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "canvas-conquest");
    formData.append("folder", "levels");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhhdozlh1/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const fetchLevels = async () => {
    const querySnapshot = await getDocs(collection(db, "levels"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const sorted = data.sort((a, b) => a.level - b.level);
    setLevels(sorted);
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const resetForm = () => {
    setLevelNumber("");
    setDescImage(null);
    setGameplayImage(null);
    setDescPreview(null);
    setGameplayPreview(null);
    setEditId(null);
  };

  const handleLevelUpload = async () => {
    if (!levelNumber || (!descImage && !descPreview) || (!gameplayImage && !gameplayPreview)) {
      alert("Lengkapi semua input atau pastikan ada gambar yang digunakan.");
      return;
    }

    try {
      let descUrl = descPreview;
      let gameplayUrl = gameplayPreview;

      if (descImage) {
        descUrl = await uploadToCloudinary(descImage);
      }

      if (gameplayImage) {
        gameplayUrl = await uploadToCloudinary(gameplayImage);
      }

      if (editId) {
        await updateDoc(doc(db, "levels", editId), {
          level: parseInt(levelNumber),
          imageUrl: descUrl,
          gameplayImageUrl: gameplayUrl,
        });
        alert("Level berhasil diperbarui!");
      } else {
        await addDoc(collection(db, "levels"), {
          level: parseInt(levelNumber),
          imageUrl: descUrl,
          gameplayImageUrl: gameplayUrl,
          createdAt: new Date(),
        });
        alert("Level berhasil ditambahkan!");
      }

      resetForm();
      fetchLevels();
    } catch (error) {
      console.error("Gagal upload:", error);
      alert("Terjadi kesalahan saat upload.");
    }
  };

  const handleDeleteLevel = async (id) => {
    await deleteDoc(doc(db, "levels", id));
    fetchLevels();
  };

  const handleEditClick = (lvl) => {
    setEditId(lvl.id);
    setLevelNumber(lvl.level);
    setDescImage(null);
    setGameplayImage(null);
    setDescPreview(lvl.imageUrl);
    setGameplayPreview(lvl.gameplayImageUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-panel">
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-icon"
        onClick={() => navigate("/admin")}
      />
      <h1 className="admin-levels-title">Manage Levels</h1>

      <div className="admin-levels-container">
        <div className="form-section">
          <h3>{editId ? "Edit Level" : "Tambah Level Baru"}</h3>
          <input
            type="number"
            placeholder="Nomor Level"
            value={levelNumber}
            onChange={(e) => setLevelNumber(e.target.value)}
          />

          <label>Gambar Deskripsi:</label>
          <div className="input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setDescImage(e.target.files[0]);
                setDescPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          {descPreview && (
            <img
              src={descPreview}
              alt="Preview Deskripsi"
              className="preview-img"
            />
          )}

          <label>Gambar Puzzle:</label>
          <div className="input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setGameplayImage(e.target.files[0]);
                setGameplayPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
          {gameplayPreview && (
            <img
              src={gameplayPreview}
              alt="Preview Puzzle"
              className="preview-img"
            />
          )}

          <button onClick={handleLevelUpload}>
            {editId ? "Simpan Perubahan" : "Upload Level"}
          </button>
        </div>

        <div className="level-list">
          <h2>Level Setting</h2>
          <ul>
            {levels.map((lvl, index) => (
              <li key={lvl.id}>
                <span>{index + 1}. Level {lvl.level}</span>
                <span>
                  (
                  <a href={lvl.imageUrl} target="_blank" rel="noreferrer">gambar deskripsi</a>){" "}
                  (
                  <a href={lvl.gameplayImageUrl} target="_blank" rel="noreferrer">gambar puzzle</a>)
                </span>
                <span className="level-icons">
                  <FaPen
                    className="icon-edit"
                    onClick={() => handleEditClick(lvl)}
                    title="Edit"
                  />
                  <FaTrash
                    className="icon-trash"
                    onClick={() => handleDeleteLevel(lvl.id)}
                    title="Hapus"
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminLevels;
