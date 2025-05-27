import React, { useState, useEffect } from "react";
import axios from 'axios';

const Dashboard = () => {
  const [activity, setActivity] = useState({ uploadedFiles: [], savedCharts: [] });
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fetchActivity = async () => {
    try {
      if (!token) return;
      const res = await axios.get('/api/user/activity', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivity(res.data);
    } catch (error) {
      console.error("Failed to fetch activity:", error);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Welcome to the Dashboard!</h1>
      <button
        onClick={handleLogout}
        className="mb-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-900">Your Activity</h2>

        <div className="mb-4">
          <h3 className="font-semibold text-purple-800">Uploaded Files:</h3>
          {activity.uploadedFiles.length === 0 ? (
            <p className="text-gray-600">No uploaded files yet.</p>
          ) : (
            <ul className="list-disc list-inside">
              {activity.uploadedFiles.map((file, idx) => (
                <li key={idx}>{file}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-purple-800">Saved Charts:</h3>
          {activity.savedCharts.length === 0 ? (
            <p className="text-gray-600">No saved charts yet.</p>
          ) : (
            <ul className="list-disc list-inside">
              {activity.savedCharts.map((chart, idx) => (
                <li key={idx}>{chart.chartType} - {chart.excelFileName}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
