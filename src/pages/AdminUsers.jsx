import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaSyncAlt } from "react-icons/fa"; // Ikon
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    levels_completed: 0,
    total_time: 0,
  });

  const navigate = useNavigate();

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    if (!form.username || !form.email) return alert("Isi data dengan benar");
    await addDoc(collection(db, "users"), {
      username: form.username,
      email: form.email,
      levels_completed: parseInt(form.levels_completed),
      total_time: parseInt(form.total_time),
    });
    setForm({ username: "", email: "", levels_completed: 0, total_time: 0 });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  return (
    <div className="admin-panel">
      {/* Tombol back tetap seperti login.jsx */}
      <img
        src="/assets/back-icon.png"
        alt="Back"
        className="back-icon"
        onClick={() => navigate("/admin")}
      />

      {/* Tombol Refresh */}
      <div className="refresh-wrapper">
        <button className="refresh-button" onClick={fetchUsers}>
          <FaSyncAlt style={{ marginRight: "8px" }} />
          Refresh
        </button>
      </div>

      <div className="admin-content">
        <div className="table-wrapper">
          <h2>Player Dashboard</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Levels</th>
                  <th>Total Time</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.levels_completed}</td>
                    <td>{user.total_time}</td>
                    <td>
                      <FaTrash
                        className="icon-trash"
                        onClick={() => handleDelete(user.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-group">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleInputChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
          />
          <input
            name="levels_completed"
            type="number"
            placeholder="Levels Completed"
            value={form.levels_completed}
            onChange={handleInputChange}
          />
          <input
            name="total_time"
            type="number"
            placeholder="Total Time"
            value={form.total_time}
            onChange={handleInputChange}
          />
          <button onClick={handleAddUser}>Add Player</button>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
