import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    if (username.length > 8) {
      setUsernameError("Username must be at most 8 characters");
      setIsSubmitDisabled(true);
    } else {
      setUsernameError("");
      setIsSubmitDisabled(false);
    }
  }, [username]);

  const handleRegister = async () => {
    if (username.length > 8) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      navigate("/start"); // ✅ arahkan ke halaman start.jsx
    } catch (error) {
      setRegisterError("Failed to register. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/assets/SignUp-icon.png" alt="Sign Up" className="signin-title" />

        <input
          type="text"
          placeholder="USERNAME"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && (
          <p style={{ color: "white", fontSize: "14px", marginTop: "-5px" }}>{usernameError}</p>
        )}

        <input
          type="email"
          placeholder="EMAIL"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="PASSWORD"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-submit"
          onClick={handleRegister}
          disabled={isSubmitDisabled}
        >
          SUBMIT
        </button>

        {registerError && (
          <p style={{ color: "red", fontSize: "14px", marginTop: "10px" }}>{registerError}</p>
        )}

        <div className="login-footer">
          Have an account?{" "}
          <span className="signin-link" onClick={() => navigate("/login")}>
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;
