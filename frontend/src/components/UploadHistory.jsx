import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadHistory = ({ refreshHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUploadHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/upload/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching upload history:", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUploadHistory();
  }, [token, refreshHistory]); // Re-fetch if token or refreshHistory changes

  if (loading) return <p>Loading upload history...</p>;

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Upload History</h3>
      {history.length > 0 ? (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Filename</th>
            </tr>
          </thead>
          <tbody>
            {history.map((upload, idx) => (
              <tr key={upload._id || idx}>
                <td className="border border-gray-300 px-4 py-2">{upload.filename}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No upload history found.</p>
      )}
    </div>
  );
};

export default UploadHistory;
