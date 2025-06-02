import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");

      const userRes = await axios.get("http://localhost:5000/api/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(userRes.data);

      const activityRes = await axios.get("http://localhost:5000/api/activity/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(activityRes.data);
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user.email} — {user.role}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">User Activities</h3>
        <ul>
          {activities.map((act, i) => (
            <li key={i}>
              <strong>{act.email}</strong> performed <em>{act.action}</em> on {new Date(act.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default AdminDashboard;
