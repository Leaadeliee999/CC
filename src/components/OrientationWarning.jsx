import { useEffect, useState } from "react";

const OrientationWarning = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "#000000cc",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      fontSize: "24px",
      textAlign: "center",
      padding: "20px"
    }}>
      Silakan putar perangkat Anda ke posisi <strong>landscape</strong> untuk memainkan game ini 😊
    </div>
  );
};

export default OrientationWarning;
