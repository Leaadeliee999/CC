import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start";
import Profile from "./pages/Profile";
import Level from "./pages/Level";
import Level1 from "./pages/Level1";
import Gameplay1 from "./pages/Gameplay1";
import Level2 from "./pages/Level2";
import Gameplay2 from "./pages/Gameplay2";
import Level3 from "./pages/Level3";
import Gameplay3 from "./pages/Gameplay3";
import Level4 from "./pages/Level4";
import Gameplay4 from "./pages/Gameplay4";
import Level5 from "./pages/Level5";
import Gameplay5 from "./pages/Gameplay5";
import Level6 from "./pages/Level6";
import Gameplay6 from "./pages/Gameplay6";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// ✅ Tambahkan ini
import SoundToggle from "./SoundToggle";
import OrientationWarning from "./components/OrientationWarning"; // ✅ Tambahan komponen warning

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div>
        {/* ✅ Warning tampil di semua halaman */}
        <OrientationWarning />

        <Routes>
          <Route path="/" element={<Navigate to="/landingpage" replace />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/start" element={<Start />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/level" element={<Level />} />
          <Route path="/level1" element={<Level1 />} />
          <Route path="/gameplay1" element={<Gameplay1 />} />
          <Route path="/level2" element={<Level2 />} />
          <Route path="/gameplay2" element={<Gameplay2 />} />
          <Route path="/level3" element={<Level3 />} />
          <Route path="/gameplay3" element={<Gameplay3 />} />
          <Route path="/level4" element={<Level4 />} />
          <Route path="/gameplay4" element={<Gameplay4 />} />
          <Route path="/level5" element={<Level5 />} />
          <Route path="/gameplay5" element={<Gameplay5 />} />
          <Route path="/level6" element={<Level6 />} />
          <Route path="/gameplay6" element={<Gameplay6 />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        <SoundToggle />
      </div>
    </Router>
  );
}

export default App;
