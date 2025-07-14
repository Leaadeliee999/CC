import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Description.css";

function Description() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchLevel = async () => {
      const docRef = doc(db, "levels", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setImageUrl(docSnap.data().imageUrl); // Deskripsi image
      }
    };
    fetchLevel();
  }, [id]);

  return (
    <div className="description-page" style={{ backgroundImage: `url(${imageUrl})` }}>
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
        onClick={() => navigate(`/gameplay/${id}`)}
      />
    </div>
  );
}

export default Description;
