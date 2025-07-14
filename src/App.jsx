import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start";
import Profile from "./pages/Profile";
import Level from "./pages/Level";
import Description from "./pages/Description";
import Gameplay from "./pages/Gameplay";
import Leaderboard from "./pages/Leaderboard";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import AdminLevels from "./pages/AdminLevels";
import SoundToggle from "./SoundToggle";
import OrientationWarning from "./components/OrientationWarning";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

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
        <OrientationWarning />
        <Routes>
          <Route path="/" element={<Navigate to="/landingpage" replace />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/start" element={<Start />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/level" element={<Level />} />
          <Route path="/description/:id" element={<Description />} />
          <Route path="/gameplay/:id" element={<Gameplay />} /> 
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-levels" element={<AdminLevels />} />  
        </Routes>
        <SoundToggle />
      </div>
    </Router>
  );
}

export default App;
