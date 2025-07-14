import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const currentName = user.displayName || "";
      setUsername(currentName);
      setOriginalUsername(currentName);
    }
  }, [user]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length > 8) {
      setError("Username must be 8 characters or less");
    } else if (value === originalUsername) {
      setError("You haven't changed your username");
    } else {
      setError("");
    }
  };

  const handleSave = async () => {
    if (username.length > 8 || username === originalUsername) return;

    Swal.fire({
      title: "Do you want to save the changes?",
      showCancelButton: true,
      confirmButtonText: "Save",
      customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateProfile(user, { displayName: username });
          setOriginalUsername(username);
          Swal.fire("Saved!", "Username updated successfully.", "success");
        } catch (error) {
          Swal.fire("Error", "Update failed: " + error.message, "error");
        }
      }
    });
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, log out',
      customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel'
      }
    });

    if (result.isConfirmed) {
      try {
        await auth.signOut();
        await Swal.fire('Logged out!', 'You have been logged out.', 'success');
        navigate("/login");
      } catch (error) {
        Swal.fire('Error', 'Logout failed: ' + error.message, 'error');
      }
    }
  };

  return (
    <div className="profile-page">
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-icon"
        onClick={() => navigate("/start")}
      />

      <div className="profile-box">
        <h2>PROFILE</h2>
        <input
          type="text"
          value={username}
          placeholder="USERNAME"
          onChange={handleUsernameChange}
        />
        {error && <p className="error-text">{error}</p>}

        <button
          className="savechange"
          onClick={handleSave}
          disabled={username === originalUsername || username.length > 8}
        >
          SAVE CHANGE
        </button>

        <button className="logout" onClick={handleLogout}>
          LOG OUT
        </button>
      </div>
    </div>
  );
}

export default Profile;
