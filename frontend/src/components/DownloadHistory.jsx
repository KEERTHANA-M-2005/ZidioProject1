import React, { useState, useEffect } from "react";
import axios from "axios";

const DownloadHistory = ({ refreshHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDownloadHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/activity/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Extract savedCharts from the activity data
        setHistory(res.data?.savedCharts || []);
      } catch (error) {
        console.error("Error fetching download history:", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloadHistory();
  }, [token, refreshHistory]); // Re-fetch if token or refreshHistory changes

  if (loading) return <p>Loading download history...</p>;

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Download History</h3>
      {history.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Chart Type</th>
              <th className="border border-gray-300 px-4 py-2">File Name</th>
              <th className="border border-gray-300 px-4 py-2">Generated At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((download, idx) => (
              <tr key={download._id || idx}>
                <td className="border border-gray-300 px-4 py-2">{download.chartType || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{download.excelFileName || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(download.generatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No download history found.</p>
      )}
    </div>
  );
};

export default DownloadHistory; 