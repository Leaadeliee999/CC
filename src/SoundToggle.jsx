import React, { useState, useEffect, useRef } from "react";
import "./SoundToggle.css";

function SoundToggle() {
  const [isSoundOn, setIsSoundOn] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedSound = localStorage.getItem("sound");
    if (savedSound !== null) {
      setIsSoundOn(savedSound === "on");
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isSoundOn) {
      audio.volume = 0.3;
      audio.loop = true;
      audio.play().catch((e) => console.log("Autoplay prevented:", e));
    } else {
      audio.pause();
    }
  }, [isSoundOn]);

  const toggleSound = () => {
    const newSoundState = !isSoundOn;
    setIsSoundOn(newSoundState);
    localStorage.setItem("sound", newSoundState ? "on" : "off");
  };

  return (
    <>
      <img
        src="/assets/sound-on.png"
        alt="Sound On"
        className={`sound-on-icon ${isSoundOn ? "visible" : "hidden"}`}
        onClick={toggleSound}
      />
      <img
        src="/assets/sound-off.png"
        alt="Sound Off"
        className={`sound-off-icon ${!isSoundOn ? "visible" : "hidden"}`}
        onClick={toggleSound}
      />
      <audio ref={audioRef} src="/assets/Fairy-Tale.mp3" />
    </>
  );
}

export default SoundToggle;
