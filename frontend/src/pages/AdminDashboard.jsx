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

  const refresh = async () => {
    const token = localStorage.getItem('token');
    const [uRes, aRes] = await Promise.all([
      axios.get('http://localhost:5000/api/user/all', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/activity/all', { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    setUsers(uRes.data);
    setActivities(aRes.data);
  };

  const handlePromote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/user/${id}/promote`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await refresh();
      alert('User promoted');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDemote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/user/${id}/demote`, {}, { headers: { Authorization: `Bearer ${token}` } });
      await refresh();
      alert('User demoted');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and all related data?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await refresh();
      alert('User deleted');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white p-4 rounded shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{user.name || 'No name'}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.role}</p>
                  <p className="text-xs text-gray-500">Uploads: {user.uploadCount || 0}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handlePromote(user._id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm">Promote</button>
                <button onClick={() => handleDemote(user._id)} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">Demote</button>
                <button onClick={() => handleDelete(user._id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">User Activities</h3>
        <div className="space-y-2">
          {activities.map((act, i) => (
            <div key={i} className="bg-white p-3 rounded shadow-sm border flex justify-between">
              <div>
                <strong>{act.email}</strong>
                <div className="text-sm text-gray-600">{act.action} — {act.details?.fileName || act.details?.chartType || ''}</div>
              </div>
              <div className="text-xs text-gray-500">{new Date(act.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default AdminDashboard;
