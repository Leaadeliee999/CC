import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import "./Login.css";

const provider = new GoogleAuthProvider();

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login berhasil!");
      navigate("/start");
    } catch (error) {
      alert("Gagal login: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          createdAt: new Date(),
        });
      }

      alert(`Login Google berhasil! Selamat datang, ${user.displayName}`);
      navigate("/start");
    } catch (error) {
      alert("Google Sign-in gagal: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-icon"
        onClick={() => navigate("/")}
      />

      <div className="login-container">
        <img src="/assets/SignIn-icon.png" alt="Sign In" className="signin-title" />

        <input
          type="email"
          placeholder="EMAIL"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="PASSWORD"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VscEyeClosed size={22} /> : <VscEye size={22} />}
          </button>
        </div>

        <button className="login-submit" onClick={handleEmailLogin}>
          SUBMIT
        </button>

        <button className="login-google" onClick={handleGoogleLogin}>
          <img
            src="https://img.icons8.com/color/16/google-logo.png"
            alt="G"
            style={{ marginRight: "8px" }}
          />
          Sign in with Google
        </button>

        <div className="login-footer">
          Don't have an account?{" "}
          <span className="signin-link" onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
