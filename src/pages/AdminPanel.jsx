import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", levels_completed: 0, total_time: 0 });
  const [editingUserId, setEditingUserId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const handleEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      levels_completed: user.levels_completed,
      total_time: user.total_time,
    });
    setEditingUserId(user.id);
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "users", editingUserId), {
      username: form.username,
      email: form.email,
      levels_completed: parseInt(form.levels_completed),
      total_time: parseInt(form.total_time),
    });
    setForm({ username: "", email: "", levels_completed: 0, total_time: 0 });
    setEditingUserId(null);
    fetchUsers();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Username,Email,Levels Completed,Total Time"]
        .concat(users.map(u => `${u.username},${u.email},${u.levels_completed},${u.total_time}`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-panel">
      <button className="back-button" onClick={() => navigate("/start")}>
        <img src="/assets/back-icon.png" alt="Back" />
      </button>

      <h1>ADMIN PANEL</h1>
      <div className="admin-content">
        <div className="table-wrapper">
          <h2>DAFTAR PEMAIN</h2>
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
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.levels_completed}</td>
                    <td>{user.total_time}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(user)}>✎</button>
                      <button onClick={() => handleDelete(user.id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-group">
          <input name="username" placeholder="Username" value={form.username} onChange={handleInputChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleInputChange} />
          <input name="levels_completed" type="number" value={form.levels_completed} onChange={handleInputChange} />
          <input name="total_time" type="number" value={form.total_time} onChange={handleInputChange} />
          {editingUserId ? (
            <button onClick={handleUpdate}>Update</button>
          ) : (
            <button onClick={handleAddUser}>Add User</button>
          )}
          <button onClick={handleExportCSV}>Export to CSV</button>
          <button onClick={fetchUsers}>Refresh</button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
